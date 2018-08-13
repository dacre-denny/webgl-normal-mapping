precision highp float;

varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec4 vPosition;
varying vec3 vTangent;
varying vec3 vNormal;

uniform mat4 uModelViewMatrix;

uniform sampler2D uSampler;
uniform sampler2D uSamplerB;
uniform float time;
uniform vec3 uLightPosition;

void main() {

  vec3 lightDirection = normalize(vPosition.xyz - uLightPosition);
  vec3 normal = normalize(vNormal);
  vec3 tangent = normalize(vTangent);

  vec3 lsNormal = vec3(uModelViewMatrix * vec4(normal.xyz, 0.0));
  vec3 lsTangent = vec3(uModelViewMatrix * vec4(tangent.xyz, 0.0));
  vec3 lsDirection = vec3(uModelViewMatrix * vec4(lightDirection.xyz, 0.0));

  float diffuse = max(0.2, dot(lightDirection, normal));

  gl_FragColor = vec4(diffuse,diffuse,diffuse,1.0);
}