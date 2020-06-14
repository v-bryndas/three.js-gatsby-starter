attribute vec4 position; 

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 v_position_xy;

void main() {
    v_position_xy = position.xy;
    
    // the order matters first projectionMatrix than modelViewMatrix and than position
    // idk why :/
    gl_Position = projectionMatrix * modelViewMatrix * position;
}