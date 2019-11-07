import { BufferAttribute, BufferGeometry, Plane, Vector3, Points } from 'three';
import React, { useMemo, useRef } from 'react';
import { GroundMaterial } from './GroundMaterial';
import { useFrame, ReactThreeFiber } from 'react-three-fiber';

const PLANE_Y = -60;
const Y_AXIS = new Vector3(0, -1, 0);
const ROTATION_SPEED = 20;
const COLOR = [1, 1, 1];

export function Ground() {
  const geometry = useMemo<BufferGeometry>(() => buildGeometry(500, 500, 1.0), []);
  const material = useMemo(() => new GroundMaterial(), []);
  const plane = useMemo(() => new Plane(Y_AXIS, PLANE_Y), []);
  const pointsRef = useRef<ReactThreeFiber.Object3DNode<Points, typeof Points>>();

  useFrame(ctx => {
    const mouse = ctx.mouse.clone();

    ctx.raycaster.setFromCamera(mouse, ctx.camera);
    const intersection = ctx.raycaster.ray.intersectPlane(plane, new Vector3());
    if (intersection) {
      material.setIntersection(intersection);
    }

    const points = pointsRef.current;
    if (points) {
      pointsRef.current!.rotateY!(ctx.clock.getDelta() * ROTATION_SPEED);
    }
  });

  return (
    <points
      ref={pointsRef}
      material={material}
      geometry={geometry}
      position={[0, PLANE_Y, 0]}
    ></points>
  );
}

function buildGeometry(xPoints: number, yPoints: number, spacing: number): BufferGeometry {
  const NUM_POINTS = xPoints * yPoints;
  const positions = new Float32Array(NUM_POINTS * 3);
  const colors = new Float32Array(NUM_POINTS * 3);

  const width = (xPoints + 1) * spacing;
  const height = (yPoints + 1) * spacing;

  const [r, g, b] = COLOR;

  let k = 0;
  for (let i = 0; i < xPoints; ++i) {
    for (let j = 0; j < yPoints; ++j) {
      const u = i / xPoints;
      const v = j / yPoints;

      const x = (u - 0.5) * width;
      const y = Math.cos(u) * Math.sin(v);
      const z = (v - 0.5) * height;

      const offset = 3 * k;
      positions[offset] = x;
      positions[offset + 1] = y;
      positions[offset + 2] = z;

      colors[offset] = r;
      colors[offset + 1] = g;
      colors[offset + 2] = b;

      k++;
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));

  return geometry;
}
