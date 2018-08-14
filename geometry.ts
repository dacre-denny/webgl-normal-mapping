import {vec3} from 'gl-matrix'
import {Shader} from './shader'

class Geometry {

    buffer: number[];
}

class Vertex {
    geometry: number;
    offset : number;

    get position() : vec3 {

        return []
    };
    normal : vec3;
    tangent : vec3;
    color : vec3;
    uv : vec3;
}

function render(gl:WebGL2RenderingContext, shader:Shader) {
    
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      shader.attributes.position,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      shader.attributes.position);
  }

  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
      shader.attributes.color,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      shader.attributes.color);
  }

  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uv);
    gl.vertexAttribPointer(
      shader.attributes.texcoord,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      shader.attributes.texcoord);
  }
 
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
      shader.attributes.normal,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      shader.attributes.normal);
  }

  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.tangent);
    gl.vertexAttribPointer(
      shader.attributes.tangent,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      shader.attributes.tangent);
  }
}

function initBuffers(gl:WebGL2RenderingContext) {

    const typedArray = new Float32Array([
        -1.0, +1.0, 0.0, /**/ 0.0, 1.0, /**/ 0.0, 1.0, 0.0, 1.0, /**/ 0.0, 1.0, 0.0, /**/ 0.0, 0.0, 1.0,
        +1.0, +1.0, 0.0, /**/ 0.0, 1.0, /**/ 0.0, 1.0, 0.0, 1.0, /**/ 0.0, 1.0, 0.0, /**/ 0.0, 0.0, 1.0,
        -1.0, -1.0, 0.0, /**/ 0.0, 1.0, /**/ 0.0, 1.0, 0.0, 1.0, /**/ 0.0, 1.0, 0.0, /**/ 0.0, 0.0, 1.0,
        +1.0, -1.0, 0.0, /**/ 0.0, 1.0, /**/ 0.0, 1.0, 0.0, 1.0, /**/ 0.0, 1.0, 0.0, /**/ 0.0, 0.0, 1.0,
      ]);
    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER,
      typedArray,
      gl.STATIC_DRAW);

    return {
        typedArray,
        buffer
    }
/*

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
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
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
      position: buffer,
      color: colorBuffer,
      uv: uvBuffer,
      normal: normalBuffer,
      tangent: tangentBuffer,
    };
    */
  }
  