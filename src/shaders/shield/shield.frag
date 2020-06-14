precision highp float;

uniform float u_alpha; 
uniform float u_delta;
uniform float u_time;
uniform float u_scale;

varying vec2 v_position_xy;

#define PI 3.1415926535897932384626433832795

bool inside_triangle(vec2 P, vec4 TRIANGLE[3]) {
    vec4 A = TRIANGLE[0];
    vec4 B = TRIANGLE[1];
    vec4 C = TRIANGLE[2];

    float w1 = (A.x * (C.y - A.y) + (P.y - A.y) * (C.x - A.x) - P.x * (C.y - A.y)) / ((B.y - A.y) * (C.x - A.x) - (B.x - A.x) * (C.y - A.y));
    float w2 = (P.y - A.y - w1 * (B.y - A.y)) / (C.y - A.y);

    if(w1 >= 0.0 && w2 >= 0.0 && (w1 + w2) <= 1.0) {
        return true;
    }
}

mat4 rotationZ( in float angle ) {
	return mat4(	cos(angle),		-sin(angle),	0,	0,
			 		sin(angle),		cos(angle),		0,	0,
							0,				0,		1,	0,
							0,				0,		0,	1);
}

void main() {

    // mat4 rotateMatrix = rotationZ(-pow(u_delta, 3.0));
    // float angle = -u_delta * (u_delta - 2.0);
    mat4 rotateMatrix = mat4(1.0);

    // vec4 scale = vec4(u_time, u_time, 0.0, 0.0);
    vec4 scale = vec4(1.0);

    vec4 TOP_RIGHT_TRIANGLE[3];
    TOP_RIGHT_TRIANGLE[0] = vec4(0.0, 0.0, 0.0, 1.0) * rotateMatrix * scale; 
    TOP_RIGHT_TRIANGLE[1] = vec4(0.0, 1.0, 0.0, 1.0) * rotateMatrix * scale; 
    TOP_RIGHT_TRIANGLE[2] = vec4(1.0, 1.0, 0.0, 1.0) * rotateMatrix * scale;

    vec4 TOP_LEFT_TRIANGLE[3];
    TOP_LEFT_TRIANGLE[0] = vec4(0.0, 0.0, 0.0, 1.0) * rotateMatrix * scale; 
    TOP_LEFT_TRIANGLE[1] = vec4(-1.0, 0.0, 0.0, 1.0) * rotateMatrix * scale; 
    TOP_LEFT_TRIANGLE[2] = vec4(-1.0, 1.0, 0.0, 1.0) * rotateMatrix * scale;

    vec4 BOTTOM_RIGHT_TRIANGLE[3];
    BOTTOM_RIGHT_TRIANGLE[0] = vec4(0.0, 0.0, 0.0, 1.0) * rotateMatrix * scale; 
    BOTTOM_RIGHT_TRIANGLE[1] = vec4(1.0, 0.0, 0.0, 1.0) * rotateMatrix * scale; 
    BOTTOM_RIGHT_TRIANGLE[2] = vec4(1.0, -1.0, 0.0, 1.0) * rotateMatrix * scale;

    vec4 BOTTOM_LEFT_TRIANGLE[3];
    BOTTOM_LEFT_TRIANGLE[0] = vec4(0.0, 0.0, 0.0, 1.0) * rotateMatrix * scale; 
    BOTTOM_LEFT_TRIANGLE[1] = vec4(0.0, -2.0, 0.0, 1.0) * rotateMatrix * scale; 
    BOTTOM_LEFT_TRIANGLE[2] = vec4(-2.0, -2.0, 0.0, 1.0) * rotateMatrix * scale;

    vec4 color = vec4(1,1,1, u_alpha);
    
    if(inside_triangle(v_position_xy, TOP_RIGHT_TRIANGLE) || 
       inside_triangle(v_position_xy, TOP_LEFT_TRIANGLE) || 
       inside_triangle(v_position_xy, BOTTOM_LEFT_TRIANGLE) ||
       inside_triangle(v_position_xy, BOTTOM_RIGHT_TRIANGLE)) {
        color = vec4(0,0,0, u_alpha);
    }

    gl_FragColor = color;
}