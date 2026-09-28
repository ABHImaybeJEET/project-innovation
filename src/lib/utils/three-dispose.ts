import * as THREE from "three";

export function disposeThreejsObject(scene: THREE.Object3D) {
  scene.traverse((object) => {
    // @ts-expect-error - checking for geometry/material properties generically
    if (object.geometry && typeof object.geometry.dispose === 'function') {
      // @ts-expect-error - dynamic dispatch
      object.geometry.dispose();
    }
    
    // @ts-expect-error - checking for geometry/material properties generically
    if (object.material) {
      // @ts-expect-error - dynamic assignment
      const material = object.material;
      if (Array.isArray(material)) {
        material.forEach((mat) => {
          if (typeof mat.dispose === 'function') {
            mat.dispose();
          }
        });
      } else if (typeof material.dispose === 'function') {
        material.dispose();
      }
    }
  });
}
