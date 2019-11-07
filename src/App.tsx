import React, { Suspense, useMemo } from 'react';
import { useSpring } from '@react-spring/three';
import { Canvas, useFrame } from 'react-three-fiber';
import { Vector2 } from 'three';
import { Ground } from './Ground';
import { useTimeout } from './hooks/use-timeout';
import { Title } from './Title';

const IDLE_DELAY = 3000;

function Scene() {
  const [{ mouse }, set] = useSpring(() => ({ mouse: [0, 0] as [number, number] }));
  const delayTimeout = useTimeout(() => set({ mouse: [0, 0] }), IDLE_DELAY, [set]);
  const lastMouse = useMemo<Vector2>(() => new Vector2(), []);

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
      <Title mouse={mouse} />
      <Ground />
    </>
  );
}

export function App() {
  return (
    <>
      <Canvas camera={{ position: [0, 2, 1], rotation: [-Math.PI / 3, 0, 0], far: 1000 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </>
  );
}
