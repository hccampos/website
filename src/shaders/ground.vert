uniform vec3 intersection;
varying vec4 vColor;

void main() {
  vec4 pixel = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  vec4 intWorld = projectionMatrix * viewMatrix * vec4(intersection, 1.);

  float dist = distance(pixel.xyz, intWorld.xyz) / 30.;
  float factor = dist * dist + 1.;

  vec4 newPosition = vec4(
    position.x,
    position.y + 20. / factor,
    position.z,
    1.
  );

  vColor = vec4(color.rgb, 3. / factor / factor);

  gl_PointSize = 2.0 / factor;
  gl_Position = projectionMatrix * modelViewMatrix * newPosition;
}