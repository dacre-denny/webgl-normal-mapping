varying highp vec4 vColor;
varying highp vec2 vUV;
    
void main() {
  gl_FragColor = vColor;
  gl_FragColor.xy = vUV;
}