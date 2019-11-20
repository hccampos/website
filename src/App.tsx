import React, { Suspense, useMemo } from 'react';
import { useSpring, interpolate } from '@react-spring/three';
import { extend, Canvas, useFrame } from 'react-three-fiber';
import { Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass';
import { useTimeout } from './hooks/use-timeout';
import { Room } from './Room';
import { Camera } from './Camera';
import { Terrain } from './Terrain';
import { Clouds } from './Clouds';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SSAOPass = require('./postprocessing/SSAOPass').SSAOPass;
extend({ EffectComposer, SSAOPass, RenderPass, SAOPass });

const IDLE_DELAY = 3000;
const MAX_ROTATION = Math.PI / 7;

function Scene() {
  const [{ mouse, cameraPosition, cameraRotation }, set] = useSpring(() => ({
    mouse: [0, 0],
    cameraPosition: [0.08, 1.7, -19.5],
    cameraRotation: [0, -Math.PI, 0],
  }));
  const delayTimeout = useTimeout(() => set({ mouse: [0, 0] }), IDLE_DELAY, [set]);
  const lastMouse = useMemo<Vector2>(() => new Vector2(), []);

  const combinedRotation = interpolate([mouse, cameraRotation], ([x, y], [rx, ry]) => {
    return [rx + y * MAX_ROTATION, ry - x * MAX_ROTATION, 0];
  });

  useFrame(ctx => {
    if (!ctx.mouse || ctx.mouse.equals(lastMouse)) {
      return;
    }

    lastMouse.copy(ctx.mouse);

    set({ mouse: [ctx.mouse.x, ctx.mouse.y] });
    delayTimeout();
  });

  return (
    <>
      <Camera position={cameraPosition} rotation={combinedRotation}></Camera>
      <ambientLight intensity={1} />
      <directionalLight intensity={0.05} position={[1, 1, 1]}></directionalLight>
      <spotLight
        castShadow
        shadow-radius={1.5}
        shadow-bias={-0.1}
        shadow-camera-near={80}
        shadow-camera-far={200}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        intensity={1}
        position={[-25, 80, -15]}
      ></spotLight>
      <Clouds></Clouds>
      <Terrain></Terrain>
      <Room></Room>
    </>
  );
}

export function App() {
  return (
    <>
      <Canvas shadowMap>
        <Suspense fallback={null}>
          <Scene></Scene>
        </Suspense>
      </Canvas>
    </>
  );
}
