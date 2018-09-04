precision highp float;

attribute vec4 position;
attribute vec4 color; 

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float time;

varying vec4 vColor; 
varying vec3 vTangent; 
varying vec3 vNormal; 
varying vec2 vTextureCoord;
varying vec4 vPosition;

void main() { 

    vColor = color; 

    gl_Position = uProjectionMatrix * uViewMatrix * uWorldMatrix * position;
}