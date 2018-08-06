attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aVertexUV;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float time;

varying highp vec4 vColor;
varying highp vec2 vTextureCoord;

void main() {
gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
vColor = aVertexColor;
vTextureCoord = aVertexUV + vec2(sin(time), 0);
}