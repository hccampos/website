import { Color, Font, FontLoader, Group, Mesh, TextGeometryParameters, Vector3 } from 'three';
import React, { useMemo } from 'react';
import { ReactThreeFiber, useLoader, useUpdate } from 'react-three-fiber';
import { a } from '@react-spring/three';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const FONT_URL = require('../assets/source-sans-bold.font');

export interface TextProps extends ReactThreeFiber.Object3DNode<Group, typeof Group> {
  vAlign?: 'middle' | 'top' | 'bottom';
  hAlign?: 'center' | 'left' | 'right';
  size?: number;
  color?: string | number | Color;
  text: string;
}

export function Text({
  vAlign = 'middle',
  hAlign = 'center',
  size = 1,
  color = '#ffffff',
  text,
  ...props
}: TextProps) {
  const font = useLoader<Font>(FontLoader as any, FONT_URL);

  const config = useMemo<TextGeometryParameters>(
    () => ({
      font,
      size: 1,
      height: 0.001,
      curveSegments: 32,
      bevelEnabled: false,
    }),
    [font],
  );

  const mesh = useUpdate<ReactThreeFiber.Object3DNode<Mesh, typeof Mesh>>(
    self => {
      const size = new Vector3();

      const geometry = self.geometry!;
      geometry.computeBoundingBox();
      geometry.boundingBox.getSize(size);

      const position = self.position as Vector3;
      position.x = hAlign === 'center' ? -size.x / 2 : hAlign === 'right' ? 0 : -size.x;
      position.y = vAlign === 'middle' ? -size.y / 2 : vAlign === 'top' ? 0 : -size.y;
    },
    [text],
  );

  return (
    <a.group {...props} scale={[size, size, 1]}>
      <a.mesh ref={mesh}>
        <a.textGeometry attach="geometry" args={[text, config]} />
        <a.meshBasicMaterial attach="material" color={color} />
      </a.mesh>
    </a.group>
  );
}
