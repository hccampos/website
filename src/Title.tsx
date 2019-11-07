import React from 'react';
import { SpringValue } from '@react-spring/three';
import { Text } from './Text';

const MAX_ROTATION = Math.PI / 6;

export interface TitleProps {
  mouse: SpringValue<[number, number]>;
}

export function Title({ mouse }: TitleProps) {
  const rotation = mouse.to((x: number, y: number) => {
    return [-y * MAX_ROTATION - Math.PI / 4, x * MAX_ROTATION, 0];
  });

  return (
    <>
      <Text position-y={0.8} size={0.2} rotation={rotation as any} text="Hugo Campos"></Text>
      <Text
        position-y={0.35}
        position-z={0}
        rotation={rotation as any}
        size={0.08}
        text="Software/Web Developer"
      ></Text>
    </>
  );
}
