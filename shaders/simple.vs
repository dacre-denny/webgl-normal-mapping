precision highp float;

attribute vec4 position;
attribute vec4 color;
attribute vec2 texcoord;
attribute vec3 normal;
attribute vec3 tangent;

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
    vNormal = normal;
    vTangent = tangent;
    vTextureCoord = texcoord;
    vPosition = position;

    gl_Position = uProjectionMatrix * uViewMatrix * uWorldMatrix * position;
}