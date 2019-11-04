import React, { Suspense, useCallback } from 'react';
import { Text } from './Text';
import { useSpring, SpringValue } from '@react-spring/three';
import { Canvas } from 'react-three-fiber';
import { useTimeout } from './hooks/use-timeout';

const MAX_ROTATION = Math.PI / 4;
const RESET_DELAY = 2000;

function Title({ mouse }: { mouse: SpringValue<[number, number]> }) {
  const rotation = mouse.interpolate((x: number, y: number) => {
    return [y * MAX_ROTATION, x * MAX_ROTATION, 0];
  });

  return (
    <>
      <Text rotation={rotation as any} text="Hugo Campos"></Text>
      <Text
        position-z={2}
        position-y={-2}
        rotation={rotation as any}
        size={0.2}
        text="Software/Web Developer"
      ></Text>
    </>
  );
}

export function App() {
  const [{ mouse }, set] = useSpring(() => ({ mouse: [0, 0] as [number, number] }));
  const delayTimeout = useTimeout(() => set({ mouse: [0, 0] }), RESET_DELAY, [set]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      set({ mouse: [e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5] });
      delayTimeout();
    },
    [set, delayTimeout],
  );

  return (
    <>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <Suspense fallback={null}>
          <Title mouse={mouse} />
        </Suspense>
      </Canvas>
      <div className="pointer-container" onMouseMove={onMouseMove}></div>
    </>
  );
}
