precision highp float;

attribute vec4 position;
// attribute vec4 color;
attribute vec2 texcoord;
attribute vec3 normal;
attribute vec3 tangent;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float time;

varying vec4 vColor; 
varying vec3 vTangent; 
varying vec3 vNormal; 
varying vec2 vTextureCoord;
varying vec3 vPosition;

void main() { 

    vColor = vec4(1.0,0.0,0.0,1.0);
    vNormal = normal;
    vTangent = tangent;
    vTextureCoord = texcoord;
    vPosition = position.xyz;

    gl_Position = uProjectionMatrix * uModelViewMatrix * position;
}