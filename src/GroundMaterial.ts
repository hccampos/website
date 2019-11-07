import { AdditiveBlending, ShaderMaterial, Vector3, VertexColors } from 'three';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const vertexShader = require('./shaders/ground.vert');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fragmentShader = require('./shaders/ground.frag');

export class GroundMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        intersection: { type: 'vec3', value: new Vector3() },
      },
      blending: AdditiveBlending,
      vertexColors: VertexColors,
      vertexShader,
      fragmentShader,
    });
  }

  setIntersection(value: Vector3): void {
    this.uniforms.intersection.value.copy(value);
  }
}
