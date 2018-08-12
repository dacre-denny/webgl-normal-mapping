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

void main() {

  vec3 lightPosition = vec3(1.5,0.5,-1.0);
  vec3 lightDirection = normalize(vPosition.xyz - lightPosition);
  vec3 normal = normalize(vNormal);
  vec3 tangent = normalize(vTangent);

  vec3 lsNormal = vec3(uModelViewMatrix * vec4(normal.xyz, 0.0));
  vec3 lsTangent = vec3(uModelViewMatrix * vec4(tangent.xyz, 0.0));
  vec3 lsDirection = vec3(uModelViewMatrix * vec4(lightDirection.xyz, 0.0));

  float diffuse = max(0.0, dot(lsDirection, lsNormal));


  gl_FragColor = vColor * diffuse;
  // gl_FragColor.xyz = normal;
  // gl_FragColor.xyz = lightDirection;
  //  vec2 offset = texture2D(uSamplerB, vec2(sin(time), sin(time)) + vTextureCoord).xy;
  //  gl_FragColor = texture2D(uSampler, vTextureCoord + offset);
  //  gl_FragColor.xy = vTextureCoord;
}