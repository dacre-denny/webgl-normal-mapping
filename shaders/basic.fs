
precision highp float;

varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vPosition;

varying vec3 tangentLightPosition;
varying vec3 tangentVertexPosition;
varying vec3 tangentVertexNormal;

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D uSampler;
uniform sampler2D uSamplerB;
uniform vec3 uLightPosition;

void main() { 

  vec3 lightDirection = normalize(tangentLightPosition.xyz - tangentVertexPosition.xyz);
  vec3 texelNormal = normalize(texture2D(uSamplerB, vTextureCoord).xyz * 2.0 - 1.0);

  float diffuseClip = max(dot(tangentVertexNormal, lightDirection), 0.0);
  float diffuse = max(dot(texelNormal, lightDirection), 0.0) * diffuseClip;
  
  vec3 texelColor = texture2D(uSampler, vTextureCoord).xyz;

  gl_FragColor.w = 1.0;
  gl_FragColor.xyz = texelColor * diffuse;

}