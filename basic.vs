attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aVertexUV;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec4 vColor;
varying highp vec2 vUV;

void main() {
gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
vColor = aVertexColor;
vUV = aVertexUV;
}