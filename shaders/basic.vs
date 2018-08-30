
precision highp float;

attribute vec4 position;
// attribute vec4 color;
attribute vec2 texcoord;
attribute vec3 normal;
attribute vec3 tangent;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float time;
uniform vec3 uLightPosition;

varying vec4 vColor; 
varying vec3 vTangent; 
varying vec3 vBinormal; 
varying vec3 vNormal; 
varying vec2 vTextureCoord;
varying vec3 vPosition;

varying vec3 tangentLightPosition;
varying vec3 tangentVertexPosition;
varying vec3 tangentVertexNormal;

mat3 transpose(mat3 m) {
  return mat3(m[0][0], m[1][0], m[2][0],
              m[0][1], m[1][1], m[2][1],
              m[0][2], m[1][2], m[2][2]);
}

void main() { 

    vec3 T = normalize(tangent);
    vec3 N = normalize(normal);
    
    T = normalize(T - dot(T, N) * N);
    
    vec3 B = cross(N, T);

    mat3 TBN = transpose(mat3(T,B,N));
    
    tangentLightPosition = TBN * uLightPosition;
    tangentVertexPosition = TBN * position.xyz;
    tangentVertexNormal = TBN * normal;

    vBinormal = B;

    vColor = vec4(1.0,0.0,0.0,1.0);
    vNormal = normal;
    vTangent = tangent;
    vTextureCoord = texcoord;
    vPosition = position.xyz;

    gl_Position = uProjectionMatrix * uModelViewMatrix * position;
}