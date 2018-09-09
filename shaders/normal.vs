#ifndef LIGHTS
#define LIGHTS 1
#endif
precision highp float;

struct Light {
  vec3 color;
  vec3 position;
  float range;
};

attribute vec4 position; 
attribute vec2 texcoord;
attribute vec3 normal;
attribute vec3 tangent;

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
 
uniform vec3 uViewPosition;
uniform Light lights[LIGHTS];
 
varying vec2 vTextureCoord;
varying vec3 vPosition;

varying vec3 tangentVertexPosition;
varying vec3 tangentVertexNormal;
varying vec3 tangentLightPositions[LIGHTS];

varying vec3 tangentViewPosition;

mat4 inverse(mat4 m) {
  float
      a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],
      a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],
      a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],
      a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],

      b00 = a00 * a11 - a01 * a10,
      b01 = a00 * a12 - a02 * a10,
      b02 = a00 * a13 - a03 * a10,
      b03 = a01 * a12 - a02 * a11,
      b04 = a01 * a13 - a03 * a11,
      b05 = a02 * a13 - a03 * a12,
      b06 = a20 * a31 - a21 * a30,
      b07 = a20 * a32 - a22 * a30,
      b08 = a20 * a33 - a23 * a30,
      b09 = a21 * a32 - a22 * a31,
      b10 = a21 * a33 - a23 * a31,
      b11 = a22 * a33 - a23 * a32,

      det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  return mat4(
      a11 * b11 - a12 * b10 + a13 * b09,
      a02 * b10 - a01 * b11 - a03 * b09,
      a31 * b05 - a32 * b04 + a33 * b03,
      a22 * b04 - a21 * b05 - a23 * b03,
      a12 * b08 - a10 * b11 - a13 * b07,
      a00 * b11 - a02 * b08 + a03 * b07,
      a32 * b02 - a30 * b05 - a33 * b01,
      a20 * b05 - a22 * b02 + a23 * b01,
      a10 * b10 - a11 * b08 + a13 * b06,
      a01 * b08 - a00 * b10 - a03 * b06,
      a30 * b04 - a31 * b02 + a33 * b00,
      a21 * b02 - a20 * b04 - a23 * b00,
      a11 * b07 - a10 * b09 - a12 * b06,
      a00 * b09 - a01 * b07 + a02 * b06,
      a31 * b01 - a30 * b03 - a32 * b00,
      a20 * b03 - a21 * b01 + a22 * b00) / det;
}

mat3 transpose(mat3 m) {
  return mat3(m[0][0], m[1][0], m[2][0],
              m[0][1], m[1][1], m[2][1],
              m[0][2], m[1][2], m[2][2]);
}

mat3 computeTBN() {
    
    mat3 normalMatrix = transpose(mat3(uWorldMatrix));
    vec3 T = normalize( tangent);
    vec3 N = normalize( normal);  
    
    T = normalize(T - dot(T, N) * N);
    
    vec3 B = cross(N, T);
    
    return transpose(mat3(T,B,N));   
}

void main() { 

    mat4 normalInvMatrix = inverse(uWorldMatrix);
    mat3 TBN = computeTBN();    

    tangentVertexPosition = TBN * position.xyz;
    tangentVertexNormal = TBN * normal;
    tangentViewPosition = TBN * vec3(normalInvMatrix * vec4(uViewPosition, 1.0));
    
    // Compute position of each light in tangent space for fragment shader
    for(int i = 0; i < LIGHTS; i++) {
        tangentLightPositions[i] = TBN * vec3(normalInvMatrix * vec4(lights[i].position, 1.0));
    }
  
    vTextureCoord = texcoord;
    vPosition = position.xyz;

    gl_Position = uProjectionMatrix * uViewMatrix * uWorldMatrix * position;
}