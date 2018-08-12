import {
  mat4, vec3
} from 'gl-matrix'
import * as shader from './shader'
import * as textures from './texture'

const camera = {
  position : [0,0,3],
  lookat : [0,0,0],
}

document.addEventListener('keydown', (event) => {
  switch(event.keyCode) {
    case 87: {

      const v = [0,0,0] 
      
      vec3.subtract(v, camera.lookat, camera.position)
      vec3.scale(v, v, 0.1)
      vec3.add(camera.position, camera.position, v)
      
      break
    }
    case 83: {
      
      const v = [0,0,0]
      
      vec3.subtract(v, camera.lookat, camera.position)
      vec3.scale(v, v, -0.1)
      vec3.add(camera.position, camera.position, v)
      
      break
    }
  }
})

document.addEventListener('mousemove', (event) => {
  
  const t = 5 * event.movementX / document.body.clientWidth;
  
  vec3.rotateY(camera.position, camera.position, camera.lookat, t)  
})

function initBuffers(gl) {

  const positions = [-1.0, 1.0, 0.0,
    1.0, 1.0, 0.0, 
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0
  ];

  const uvs = [
    0.0, 1.0,
    1.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
  ];

  const colors = [
    0.0, 1.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 1.0, 1.0,
  ];

  const tangents = [
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
  ];
  
  const normals = [
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
  ];

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(colors),
    gl.STATIC_DRAW);

  const uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(uvs),
    gl.STATIC_DRAW);

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(normals),
    gl.STATIC_DRAW);

  const tangentBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(tangents),
    gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    uv: uvBuffer,
    normal: normalBuffer,
    tangent: tangentBuffer,
  };
}

function drawScene(gl, programInfo, buffers, texture, time) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = 45 * Math.PI / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix,
    fieldOfView,
    aspect,
    zNear,
    zFar);

  const modelViewMatrix = mat4.create();
  mat4.lookAt(modelViewMatrix, camera.position, camera.lookat, [0,1,0])

  const modelRotation = mat4.create();
  mat4.fromZRotation(modelRotation, time)

  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexPosition);
  }

  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexColor);
  }

  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uv);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexUV,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexUV);
  }
 
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexNormal,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexNormal);
  }

  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.tangent);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexTangent,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexTangent);
  }

  gl.useProgram(programInfo.program);
  

  {
    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
  }

  {
    gl.activeTexture(gl.TEXTURE1);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    gl.uniform1i(programInfo.uniformLocations.uSamplerB, 0);
  }
  
  gl.uniform1f(programInfo.uniformLocations.time, time);


  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix);
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

async function main() {

  const canvas = document.querySelector("canvas");
  const gl = canvas.getContext("webgl2");

  if (gl === null) {
    console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  const texture = await textures.loadTexture(gl, './decal.png')

  const shaderProgram = await shader.loadProgram(gl, './basic.vs', './basic.fs');
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'position'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'color'),
      vertexUV: gl.getAttribLocation(shaderProgram, 'texcoord'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'normal'),
      vertexTangent: gl.getAttribLocation(shaderProgram, 'tangent'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
      uSamplerB: gl.getUniformLocation(shaderProgram, 'uSamplerB'),
      time: gl.getUniformLocation(shaderProgram, 'time'),
    },
  };
 
  const buffers = initBuffers(gl)
  let t = 0.0;

  function render() {

    drawScene(gl, programInfo, buffers, texture, t += 0.01)

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}


main()