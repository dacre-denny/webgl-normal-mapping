import twgl from './node_modules/twgl.js/dist/3.x/twgl-full.js'

const m4 = twgl.m4;
const v3 = twgl.v3;
const gl = twgl.getWebGLContext(document.getElementById("c"));
const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);

const textures = twgl.createTextures(gl, {

    color : { 
        mag: gl.NEAREST,
        min: gl.LINEAR,
        src: "textures/sand_color.jpg" 
    },  
    normal : { 
        mag: gl.NEAREST,
        min: gl.LINEAR,
        src: "textures/sand_normal.jpg" 
    }
})

const arrays = {
  position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
  normal:   [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
  tangent: [],
  texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
  indices:  [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
};
 
for(var i = 0; i < arrays.indices.length; i += 3) {
  
  const ia = arrays.indices[i + 0]
  const ib = arrays.indices[i + 1] 
  const ic = arrays.indices[i + 2] 
  
  const va = v3.create(arrays.position[ia * 3 + 0],arrays.position[ia * 3 + 1],arrays.position[ia * 3 + 2]);
  const vb = v3.create(arrays.position[ib * 3 + 0],arrays.position[ib * 3 + 1],arrays.position[ib * 3 + 2]);
  
  const n = v3.create(arrays.normal[ia * 3 + 0],arrays.normal[ia * 3 + 1],arrays.normal[ia * 3 + 2]);
  
  var s = v3.cross(vb, va)
  var t = v3.cross(s, n)

  arrays.tangent[ ia ] = t[ 0 ]  
  arrays.tangent[ ia ] = t[ 1 ]  
  arrays.tangent[ ia ] = t[ 2 ]  

}

const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

const tex = twgl.createTexture(gl, {
  min: gl.NEAREST,
  mag: gl.NEAREST,
  src: [
    255, 255, 255, 255,
    192, 192, 192, 255,
    192, 192, 192, 255,
    255, 255, 255, 255,
  ],
});

const uniforms = {
  u_lightWorldPos: [1, 8, -10],
  u_lightColor: [1, 0.8, 0.8, 1],
  u_ambient: [0, 0, 0, 1],
  u_specular: [1, 1, 1, 1],
  u_shininess: 50,
  u_specularFactor: 1,
  u_diffuse: textures.color,
  u_normal: textures.normal
};

function render(time) {
  time *= 0.0001;
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fov = 30 * Math.PI / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.5;
  const zFar = 10;
  const projection = m4.perspective(fov, aspect, zNear, zFar);
  const eye = [1, 4, -6];
  const target = [0, 0, 0];
  const up = [0, 1, 0];

  const camera = m4.lookAt(eye, target, up);
  const view = m4.inverse(camera);
  const viewProjection = m4.multiply(projection, view);
  const world = m4.rotationY(time);

  uniforms.u_viewInverse = camera;
  uniforms.u_world = world;
  uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
  uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
