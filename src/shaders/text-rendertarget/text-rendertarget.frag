varying vec2 vUv;

uniform sampler2D u_texture;
uniform float u_uvClip;

void main() {
    vec3 texture = texture2D(u_texture, vUv).rgb;

    gl_FragColor = vec4(texture, 1.0);

    if (gl_FragColor.r < 0.5 || vUv.x > u_uvClip) discard;
}