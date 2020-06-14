attribute float pindex;
attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float u_time;
uniform float u_depth;
uniform float u_zPositionAdd;

varying vec2 v_position_xy;

#pragma glslify: snoise_1_2 = require(glsl-noise/simplex/2d)

float random(float n) {
	return fract(sin(n) * 43758.5453123);
}

void main() {
	vec3 displaced = position;

	if(u_zPositionAdd > 0.0) {
		float rndz = (random(pindex) + snoise_1_2(vec2(pindex * 0.02, u_time * 0.02)));
		displaced.z += -rndz * (random(pindex) * 2.0 * u_depth) + u_zPositionAdd * 23.0 + u_time * 1.5;

		displaced.x += snoise_1_2(vec2(pindex, u_time * 0.05)) * 0.4;
	}

	gl_PointSize = random(pindex);

	v_position_xy = position.xy;
	vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);

	gl_Position = projectionMatrix * mvPosition;
}