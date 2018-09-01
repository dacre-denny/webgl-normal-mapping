
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
void main() { 

  vec3 lightDirection = normalize(tangentLightPosition.xyz - tangentVertexPosition.xyz);
  vec3 texelNormal = normalize(texture2D(uTextureNormal, vTextureCoord).xyz * 2.0 - 1.0);

  float diffuseClip = max(dot(tangentVertexNormal, lightDirection), 0.0);
  float diffuse = max(dot(texelNormal, lightDirection), 0.0) * diffuseClip;
  
  vec3 texelColor = texture2D(uTextureColor, vTextureCoord).xyz;

  gl_FragColor = vec4(texelColor * uLightColor * diffuse, 1.0);
}