precision highp float;

varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vPosition;
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
vec3 makeVector(vec3 c) {
   vec3 v = (c.xyz * 2.0 - vec3(1.0, 1.0, 1.0));
   
  v.xy = -v.yx;
   //v.z = -v.z;
   return v;
}

mat3 transpose(mat3 m) {
  return mat3(m[0][0], m[1][0], m[2][0],
              m[0][1], m[1][1], m[2][1],
              m[0][2], m[1][2], m[2][2]);
}

void main() {
  

  vec3 normal = normalize(vNormal);
  vec3 tangent = normalize(vTangent);
  vec3 cotangent = normalize(cross(tangent, normal ));

  //vec3 texelVec = makeVector( texture2D(uSamplerB, vTextureCoord).xyz );
  // normal = normalize( texture2D(uSamplerB, vTextureCoord).xyz )

  mat3 toModelSpace = mat3(tangent, cotangent, normal);
  mat3 toTangentSpace = transpose(toModelSpace);

  //vec3 lightVecTs = toTangentSpace * lightDirection;
  vec3 normalVecTs = toTangentSpace * normal;
  
  vec3 tanLightPosition = toTangentSpace * uLightPosition;
  vec3 tanVertexPosition = toTangentSpace * vPosition;

  vec3 lightDirection = normalize(tanLightPosition - tanVertexPosition);

  vec3 offset = makeVector(texture2D(uSamplerB, vTextureCoord).xyz);
  offset = normalize(offset); // 
  float diffuse = max(dot(offset, lightDirection), 0.0);
  
  gl_FragColor.w = 1.0;

  // gl_FragColor.xyz = makeColor(cotangent);
  gl_FragColor.xyz = makeColor(normal);
  gl_FragColor.xyz = makeColor(tangent);
  gl_FragColor.xyz = makeColor(cotangent);
  // gl_FragColor.xyz = makeColor(vec3(0.0, 0.0, 1.0));
  if(vTextureCoord.x > 0.5) {

  gl_FragColor.xyz = vec3(diffuse, diffuse, diffuse);
  gl_FragColor.xyz = texture2D(uSamplerB, vTextureCoord).xyz;
  }
  else {
    
  gl_FragColor.xyz = makeColor(lightDirection);

  }
}