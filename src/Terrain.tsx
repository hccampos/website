import React from 'react';
import { useLoader } from 'react-three-fiber';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ROOM_MODEL_URL = require('../assets/terrain.glb');

export function Terrain(_: {}) {
  const gltf = useLoader<GLTF>(GLTFLoader as any, ROOM_MODEL_URL);

  return (
    <group rotation-y={Math.PI} position-y={1} position-z={20}>
      <primitive castShadow receiveShadow object={gltf.scene.children[0]} />
    </group>
  );
}
