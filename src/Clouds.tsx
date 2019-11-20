import React, { useRef } from 'react';
import { useLoader, useUpdate, useFrame } from 'react-three-fiber';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Object3D, MeshStandardMaterial, Mesh } from 'three';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MODEL_URL = require('../assets/clouds.glb');

const POSITION = [0, -7, 0];

const FAKE_FRICTION_FACTOR = 0.98;
const MASS_MIN = 80;
const MASS_MAX = 100;
const WIND_MIN = -0.00001;
const WIND_MAX = 0.00001;
const X_MIN = -11;
const X_MAX = 11;
const Y_MIN = 9.5;
const Y_MAX = 13;
const Z_MIN = -8;
const Z_MAX = 0;

interface CloudState {
  obj: Object3D;
  mass: number;
  velocity: number;
}

interface Simulation {
  wind: number;
  clouds: CloudState[];
}

export const Clouds: React.FC<{}> = _ => {
  const gltf = useLoader<GLTF>(GLTFLoader as any, MODEL_URL);

  const simulationRef = useRef<Simulation | null>(null);

  const rootRef = useUpdate<Object3D>(node => {
    node.children.forEach(setupCloudMesh);
  }, []);

  useFrame(ctx => {
    const obj = rootRef.current as Object3D;

    if (simulationRef.current === null) {
      simulationRef.current = {
        wind: getValueBetween(WIND_MIN, WIND_MAX),
        clouds: obj.children.map(getInitialCloudState),
      };
    }

    updateSimulation(simulationRef.current, ctx.clock.elapsedTime);
  });

  return (
    <group rotation-y={Math.PI} position={POSITION}>
      <primitive ref={rootRef} castShadow receiveShadow object={gltf.scene.children[0]} />
    </group>
  );
};

function setupCloudMesh(mesh: Object3D) {
  if (!(mesh instanceof Mesh)) {
    return;
  }

  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.material = new MeshStandardMaterial({ color: 0xffffff });
}

function getInitialCloudState(obj: Object3D): CloudState {
  const state: CloudState = { obj, mass: 0, velocity: 0 };
  respawn(state, true);
  return state;
}

function updateSimulation(simulation: Simulation, dt: number): void {
  simulation.clouds.forEach(cloud => updateCloud(cloud, dt, simulation.wind));
}

function updateCloud(state: CloudState, dt: number, wind: number): void {
  const pos = state.obj.position;

  const acceleration = wind / state.mass;
  state.velocity += acceleration * dt;
  pos.x += state.velocity * dt;

  state.velocity *= FAKE_FRICTION_FACTOR;

  const x = pos.x;
  if (x > X_MAX) {
    pos.x = X_MIN;
    respawn(state);
  } else if (x < X_MIN) {
    pos.x = X_MAX;
    respawn(state);
  }
}

function respawn(state: CloudState, randomizePosition = false): CloudState {
  state.mass = getValueBetween(MASS_MAX, MASS_MIN);
  state.velocity = getValueBetween(WIND_MIN, WIND_MAX);

  state.obj.scale.setScalar(0.7 + (state.mass - MASS_MAX) / MASS_MIN);

  const pos = state.obj.position;
  pos.set(
    randomizePosition ? getValueBetween(X_MIN, X_MAX) : pos.x,
    getValueBetween(Y_MIN, Y_MAX),
    getValueBetween(Z_MIN, Z_MAX),
  );

  return state;
}

function getValueBetween(min: number, max: number): number {
  return min + (max - min) * Math.random();
}
