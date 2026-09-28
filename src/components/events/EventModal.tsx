import React from "react";
import Link from "next/link";
import { X, CheckCircle2, Phone, ArrowRight } from "lucide-react";
import type { FestivalEvent } from "@/lib/data/events";

interface EventModalProps {
  event: FestivalEvent;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#03091e] border border-cyan-500/40 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {event.day}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-serif leading-tight">
            {event.title}
          </h3>
        </div>

        {/* Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Prize Pool</span>
            <span className="font-bold text-emerald-400">{event.prizePool}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Venue</span>
            <span className="font-semibold text-slate-200">{event.venue}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Time</span>
            <span className="font-semibold text-slate-200">{event.time}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Team Size</span>
            <span className="font-semibold text-slate-200">{event.teamSize}</span>
          </div>
        </div>

        {/* Full Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
            Overview
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            {event.fullDesc}
          </p>
        </div>

        {/* Rules Checklist */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
            Official Rules & Guidelines
          </h4>
          <ul className="space-y-2">
            {event.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Event Coordinators */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
            Event Coordinators
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {event.coordinators.map((c, idx) => (
              <a
                key={idx}
                href={`tel:${c.phone}`}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-white">{c.name}</p>
                  <p className="text-[11px] font-mono text-cyan-300">{c.phone}</p>
                </div>
                <Phone className="w-4 h-4 text-cyan-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>

          <Link
            href="/register"
            className="px-7 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Register Pass</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
