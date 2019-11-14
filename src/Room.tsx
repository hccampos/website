import React from 'react';
import { useLoader } from 'react-three-fiber';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ROOM_MODEL_URL = require('../assets/room.glb');

export function Room(_: {}) {
  const gltf = useLoader<GLTF>(GLTFLoader as any, ROOM_MODEL_URL);

  return <primitive receiveShadow object={gltf.scene.children[0]} />;
}
