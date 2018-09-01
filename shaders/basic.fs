
precision highp float;

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D uTextureColor;
uniform sampler2D uTextureNormal;
uniform vec3 uLightColor;
 
varying vec2 vTextureCoord;
varying vec3 vPosition;

varying vec3 tangentLightPosition;
varying vec3 tangentVertexPosition;
varying vec3 tangentVertexNormal;

varying vec3 tangentViewPosition;

void main() { 

  vec3 viewDirection = normalize(tangentViewPosition.xyz - tangentVertexPosition.xyz);
  vec3 lightDirection = normalize(tangentLightPosition.xyz - tangentVertexPosition.xyz);
  
  vec3 texelNormal = normalize(texture2D(uTextureNormal, vTextureCoord).xyz * 2.0 - 1.0);
  vec3 texelColor = texture2D(uTextureColor, vTextureCoord).xyz;

  float diffuseClip = 1.0;//(sign(dot(tangentVertexNormal, lightDirection)) + 1.0) * 0.5;
  vec3 diffuse = texelColor * max(dot(texelNormal, lightDirection), 0.0) * diffuseClip;
  
  vec3 halfVec = normalize(lightDirection+viewDirection);
  float specS = pow(max(dot(halfVec, texelNormal), 0.0), 32.0);
  vec3 spec = vec3(specS, specS, specS) * diffuseClip;

  gl_FragColor = vec4(diffuse + spec, 1.0);
}