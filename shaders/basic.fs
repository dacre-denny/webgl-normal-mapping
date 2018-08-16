precision highp float;

varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec4 vPosition;
varying vec3 vTangent;
varying vec3 vNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D uSampler;
uniform sampler2D uSamplerB;
uniform float time;
uniform vec3 uLightPosition;

void main() {

  vec3 lightDirection = normalize(vPosition.xyz - uLightPosition);

  vec3 normal = normalize(vNormal);
  vec3 tangent = normalize(vTangent);
  vec3 cotangent = normalize(cross(normal, tangent));

  mat3 tangentSpace = mat3(normal, tangent, cotangent);

  vec3 texelNormal = (texture2D(uSamplerB, vTextureCoord).xyz - vec3(0.5, 0.5, 0.5)) * 2.0;

  vec3 tangentNormal = tangentSpace * texelNormal;

  float diffuse = max(0.11, dot(lightDirection, tangentNormal));

  gl_FragColor = texture2D(uSampler, vTextureCoord) * vec4(diffuse,diffuse,diffuse,1.0);
  //gl_FragColor = texture2D(uSamplerB, vTextureCoord); // vec4(diffuse,diffuse,diffuse,1.0);
  // gl_FragColor = texture2D(uSampler, vTextureCoord); // vec4(diffuse,diffuse,diffuse,1.0);
}