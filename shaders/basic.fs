
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

  vec3 lightVec = tangentLightPosition.xyz - tangentVertexPosition.xyz;
  vec3 viewDirection = normalize(tangentViewPosition.xyz - tangentVertexPosition.xyz);
  vec3 lightDirection = normalize(lightVec);
  
  vec3 texelNormal = normalize(texture2D(uTextureNormal, vTextureCoord).xyz * 2.0 - 1.0);
  vec3 texelColor = texture2D(uTextureColor, vTextureCoord).xyz;

  float clip = max(dot(vec3(0.0,0.0,1.0), lightDirection), 0.0);
  float attenuation = clip * 1.0 / pow(length(lightVec), 2.0);
  vec3 diffuse = vec3(max(dot(texelNormal, lightDirection), 0.0)) * attenuation;
  
  vec3 halfVec = normalize(lightDirection + viewDirection);
  vec3 specular = vec3(min(pow(max(dot(halfVec, texelNormal), 0.0), 32.0), 1.0)) * attenuation;
  vec3 ambient = vec3(0.1);

  vec3 lighting = uLightColor * texelColor * (ambient + diffuse + specular);

  gl_FragColor = vec4(lighting, 1.0);
}