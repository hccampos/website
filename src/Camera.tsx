import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { PerspectiveCamera } from 'three';
import { a, SpringValue } from '@react-spring/three';

export interface CameraProps {
  position: SpringValue<number[]>;
  rotation: SpringValue<number[]>;
}

export function Camera({ position, rotation }: CameraProps) {
  const ref = useRef<PerspectiveCamera>();
  const { setDefaultCamera } = useThree();

  useEffect(() => {
    setDefaultCamera(ref.current!), [setDefaultCamera];
  });

  useFrame(() => ref.current!.updateMatrixWorld());

  const rotationY = rotation.interpolate((_x: number, y: number, _z: number) => y);
  const rotationX = rotation.interpolate((x: number, _y: number, _z: number) => x);

  return (
    <a.group position={position} rotation-y={rotationY}>
      <a.perspectiveCamera rotation-x={rotationX} ref={ref} />
    </a.group>
  );
}
