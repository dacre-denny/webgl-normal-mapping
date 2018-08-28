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

vec3 makeColor(vec3 v) {
  return (v.xyz * 0.5 + vec3(0.5, 0.5, 0.5));
}

void main() {
  
  vec3 lightDirection = normalize(vPosition.xyz - uLightPosition);

  vec3 normal = normalize(vNormal);
  vec3 tangent = normalize(vTangent);
  vec3 cotangent = normalize(cross(normal, tangent));

  mat3 tangentSpace = mat3(normal, tangent, cotangent);

  vec3 texelNormal = (texture2D(uSamplerB, vTextureCoord).xyz - vec3(0.5, 0.5, 0.5)) * 2.0;

  vec3 lightVecTs = tangentSpace * lightDirection;

  float diffuse = clamp(dot(normal, lightVecTs), 0.0, 1.0);
  
  gl_FragColor = texture2D(uSampler, vTextureCoord) * vec4(diffuse,diffuse,diffuse,1.0);
  gl_FragColor = texture2D(uSamplerB, vTextureCoord); // * vec4(diffuse,diffuse,diffuse,1.0);
  gl_FragColor.w = 1.0;
  gl_FragColor.xyz = makeColor(normal);
  gl_FragColor.xyz = makeColor(tangent);

  gl_FragColor.xyz = vec3(diffuse, diffuse, diffuse);
  // gl_FragColor.xyz = vec3(0.5, 0.0, 0.5);
}