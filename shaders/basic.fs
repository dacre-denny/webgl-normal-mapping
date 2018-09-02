#define LIGHTS 2
precision highp float;

struct Light {
  vec3 color;
  vec3 position;
  float range;
};

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D uTextureColor;
uniform sampler2D uTextureNormal;

uniform Light lights[LIGHTS];
 
varying vec2 vTextureCoord;
varying vec3 vPosition;

varying vec3 tangentVertexPosition;
varying vec3 tangentVertexNormal;
varying vec3 tangentLightPositions[LIGHTS];

varying vec3 tangentViewPosition;

vec3 computeLighting(vec3 viewDirection, vec3 texelNormal) {
  
  vec3 color = vec3(0.0,0.0,0.0);

  for(int i = 0; i < LIGHTS; i++) {
    
    vec3 lightVec = tangentLightPositions[i].xyz - tangentVertexPosition.xyz;
    vec3 lightDirection = normalize(lightVec);
    
    float clip = max(dot(vec3(0.0,0.0,1.0), lightDirection), 0.0);
    float attenuation = clip * 1.0 / pow(length(lightVec), 2.0);
    
    vec3 diffuse = vec3(max(dot(texelNormal, lightDirection), 0.0)) * attenuation;

    vec3 halfVec = normalize(lightDirection + viewDirection);
    vec3 specular = vec3(min(pow(max(dot(halfVec, texelNormal), 0.0), 32.0), 1.0)) * attenuation;
    
    color += lights[i].color * (diffuse + specular);
  }

  return color;
}

void main() { 

  vec3 viewDirection = normalize(tangentViewPosition.xyz - tangentVertexPosition.xyz);
  
  vec3 texelNormal = normalize(texture2D(uTextureNormal, vTextureCoord).xyz * 2.0 - 1.0);
  vec3 texelColor = texture2D(uTextureColor, vTextureCoord).xyz;
  
  vec3 ambient = vec3(0.1);

  vec3 lighting = computeLighting(viewDirection, texelNormal);
  vec3 L = texelColor * (lighting + ambient);
  gl_FragColor = vec4(L, 1.0);
}