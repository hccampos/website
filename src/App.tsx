import React, { Suspense, useMemo } from 'react';
import { useSpring, interpolate } from '@react-spring/three';
import { Canvas, useFrame } from 'react-three-fiber';
import { Vector2 } from 'three';
import { useTimeout } from './hooks/use-timeout';
import { Room } from './Room';
import { Camera } from './Camera';
import { Terrain } from './Terrain';

const IDLE_DELAY = 3000;
const MAX_ROTATION = Math.PI / 6;

function Scene() {
  const [{ mouse, cameraPosition, cameraRotation }, set] = useSpring(() => ({
    mouse: [0, 0],
    cameraPosition: [0, 1.5, 0.6],
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
      <ambientLight intensity={0.8} />
      <directionalLight intensity={0.5} position={[5, 5, 5]}></directionalLight>
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
          <Scene />
        </Suspense>
      </Canvas>
    </>
  );
}
