import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface DetailsPayload {
  fullName?: string;
  phone?: string;
  college?: string;
  department?: string;
  yearOfStudy?: string;
  stateCity?: string;
  tshirtSize?: string;
}

/**
 * GET /api/details
 * Retrieves participant details from Supabase `profiles` database table
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthenticated" },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("GET /api/details database error:", error);
    }

    if (!profile) {
      return NextResponse.json({
        success: true,
        details: null,
      });
    }

    return NextResponse.json({
      success: true,
      details: {
        userId: profile.id,
        fullName: profile.full_name,
        email: profile.email || user.email,
        phone: profile.phone,
        college: profile.college,
        department: profile.department || "General Engineering",
        yearOfStudy: profile.year_of_study || "3rd Year",
        stateCity: profile.state_city || "India",
        tshirtSize: profile.tshirt_size || "L",
        passId: profile.pass_id || `INNO-2026-${profile.id.substring(0, 4).toUpperCase()}`,
        updatedAt: profile.updated_at,
      },
    });
  } catch (err: unknown) {
    console.error("GET /api/details error:", err);
    return NextResponse.json(
      { success: false, error: "Server error fetching details" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/details
 * Upserts participant credentials into Supabase `profiles` database table
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required to update details." },
        { status: 401 }
      );
    }

    let body: DetailsPayload = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload" },
        { status: 422 }
      );
    }

    const { fullName, phone, college, department, yearOfStudy, stateCity, tshirtSize } = body;

    if (!fullName?.trim() || !phone?.trim() || !college?.trim()) {
      return NextResponse.json(
        { success: false, error: "Full Name, Phone, and College Name are required fields." },
        { status: 422 }
      );
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      return NextResponse.json(
        { success: false, error: "Mobile number must be exactly 10 digits." },
        { status: 422 }
      );
    }

    const supabase = await createClient();

    // Check existing profile to retain pass_id
    const { data: existing } = await supabase
      .from("profiles")
      .select("pass_id")
      .eq("id", user.id)
      .maybeSingle();

    const passId = existing?.pass_id || `INNO-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const profileData = {
      id: user.id,
      email: user.email,
      full_name: fullName.trim(),
      phone: phone.trim(),
      college: college.trim(),
      department: (department || "General Engineering").trim(),
      year_of_study: yearOfStudy || "3rd Year",
      state_city: (stateCity || "India").trim(),
      tshirt_size: tshirtSize || "L",
      pass_id: passId,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedProfile, error: dbError } = await supabase
      .from("profiles")
      .upsert(profileData, { onConflict: "id" })
      .select()
      .single();

    if (dbError) {
      console.error("Supabase DB upsert error:", dbError);
      return NextResponse.json(
        {
          success: false,
          error: "Database storage error: " + dbError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Participant details saved to Supabase Database successfully.",
      details: {
        userId: updatedProfile.id,
        fullName: updatedProfile.full_name,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        college: updatedProfile.college,
        department: updatedProfile.department,
        yearOfStudy: updatedProfile.year_of_study,
        stateCity: updatedProfile.state_city,
        tshirtSize: updatedProfile.tshirt_size,
        passId: updatedProfile.pass_id,
        updatedAt: updatedProfile.updated_at,
      },
    });
  } catch (err: unknown) {
    console.error("POST /api/details server error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred while saving details.",
      },
      { status: 500 }
    );
  }
}
