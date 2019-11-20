import React from 'react';
import { useLoader, useUpdate } from 'react-three-fiber';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Mesh, MeshStandardMaterial } from 'three';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MODEL_URL = require('../assets/terrain.glb');
const SCALE = [1, 0.6, 1];
const POSITION = [0, -3, 0];

export function Terrain(_: {}) {
  const gltf = useLoader<GLTF>(GLTFLoader as any, MODEL_URL);

  const ref = useUpdate<Mesh>(mesh => {
    (mesh.material as MeshStandardMaterial).metalness = 0.5;
  }, []);

  return (
    <group rotation-y={Math.PI} position={POSITION} scale={SCALE}>
      <primitive ref={ref} castShadow receiveShadow object={gltf.scene.children[0]} />
    </group>
  );
}
