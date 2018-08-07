precision highp float;

varying vec4 vColor;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSamplerB;
uniform float time;

void main() {
  gl_FragColor = vColor;
  vec2 offset = texture2D(uSamplerB, vec2(sin(time), sin(time)) + vTextureCoord).xy;
  gl_FragColor = texture2D(uSampler, vTextureCoord + offset);
  gl_FragColor.xy = vTextureCoord;
}