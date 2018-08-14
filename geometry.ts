import { vec3 } from "gl-matrix";
import { Shader } from "./shader";

interface Geometry {
  buffer: WebGLBuffer;
  typedArray: Float32Array;
}

class Vertex {
  //  geometry: number;
  //  offset: number;

  set position(v: vec3) {}
  normal: vec3;
  tangent: vec3;
  color: vec3;
  uv: vec3;
}

class SimpleVertex {
  private buffer: Float32Array;
  private static size: number = 6;
  position: vec3;
  color: vec3;

  static createBuffer(gl: WebGL2RenderingContext, vertices: SimpleVertex[]) {
    const typedArray = new Float32Array(SimpleVertex.size * vertices.length);

    for (const vertex of vertices) {
      vertex.buffer = typedArray;
    }

    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, typedArray, gl.STATIC_DRAW);
  }
}

function render(
  gl: WebGL2RenderingContext,
  geometry: Geometry,
  shader: Shader
) {
  const stride = 15;

  gl.bindBuffer(gl.ARRAY_BUFFER, geometry.buffer);

  // position
  gl.vertexAttribPointer(
    shader.attributes.position,
    3,
    gl.FLOAT,
    false,
    Float32Array.BYTES_PER_ELEMENT * stride,
    Float32Array.BYTES_PER_ELEMENT * 0
  );
  gl.enableVertexAttribArray(shader.attributes.position);

  // texcoord
  gl.vertexAttribPointer(
    shader.attributes.texcoord,
    2,
    gl.FLOAT,
    false,
    Float32Array.BYTES_PER_ELEMENT * stride,
    Float32Array.BYTES_PER_ELEMENT * 3
  );
  gl.enableVertexAttribArray(shader.attributes.texcoord);

  // color
  gl.vertexAttribPointer(
    shader.attributes.color,
    4,
    gl.FLOAT,
    false,
    Float32Array.BYTES_PER_ELEMENT * stride,
    Float32Array.BYTES_PER_ELEMENT * 5
  );
  gl.enableVertexAttribArray(shader.attributes.color);

  // normal
  gl.vertexAttribPointer(
    shader.attributes.normal,
    3,
    gl.FLOAT,
    false,
    Float32Array.BYTES_PER_ELEMENT * stride,
    Float32Array.BYTES_PER_ELEMENT * 8
  );
  gl.enableVertexAttribArray(shader.attributes.normal);

  //tangent
  gl.vertexAttribPointer(
    shader.attributes.tangent,
    3,
    gl.FLOAT,
    false,
    Float32Array.BYTES_PER_ELEMENT * stride,
    Float32Array.BYTES_PER_ELEMENT * 11
  );
  gl.enableVertexAttribArray(shader.attributes.tangent);
}

function initBuffers(gl: WebGL2RenderingContext): Geometry {
  const typedArray = new Float32Array([
    -1.0,
    +1.0,
    0.0,
    /**/ 0.0,
    1.0,
    /**/ 0.0,
    1.0,
    0.0,
    1.0,
    /**/ 0.0,
    1.0,
    0.0,
    /**/ 0.0,
    0.0,
    1.0,
    +1.0,
    +1.0,
    0.0,
    /**/ 0.0,
    1.0,
    /**/ 0.0,
    1.0,
    0.0,
    1.0,
    /**/ 0.0,
    1.0,
    0.0,
    /**/ 0.0,
    0.0,
    1.0,
    -1.0,
    -1.0,
    0.0,
    /**/ 0.0,
    1.0,
    /**/ 0.0,
    1.0,
    0.0,
    1.0,
    /**/ 0.0,
    1.0,
    0.0,
    /**/ 0.0,
    0.0,
    1.0,
    +1.0,
    -1.0,
    0.0,
    /**/ 0.0,
    1.0,
    /**/ 0.0,
    1.0,
    0.0,
    1.0,
    /**/ 0.0,
    1.0,
    0.0,
    /**/ 0.0,
    0.0,
    1.0
  ]);
  const buffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, typedArray, gl.STATIC_DRAW);

  return {
    typedArray,
    buffer
  };
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
