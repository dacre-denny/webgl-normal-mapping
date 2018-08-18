import { vec3 } from "gl-matrix";
import { Shader } from "./shader";
import * as Cube from "./cube.json";

interface Geometry {
  buffer: WebGLBuffer;
  typedArray: Float32Array;
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

interface Buffer {
  attributes: { [key: string]: { offset: number; components: number } };
  buffer: WebGLBuffer;
  indices?: WebGLBuffer;
}

export function createCube(gl: WebGL2RenderingContext): Buffer {
  const position = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, position);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(Cube.positions),
    gl.STATIC_DRAW
  );

  const normal = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normal);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(Cube.normals),
    gl.STATIC_DRAW
  );

  const tangent = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tangent);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(Cube.tangents),
    gl.STATIC_DRAW
  );

  const texcoord = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoord);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(Cube.texcoords),
    gl.STATIC_DRAW
  );

  const color = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, color);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Cube.colors), gl.STATIC_DRAW);

  const indices = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(Cube.indices),
    gl.STATIC_DRAW
  );

  return { attributes: {}, buffer: position, indices };
}

export function createBuff(
  gl: WebGL2RenderingContext,
  attributes: { [key: string]: { data: number[]; components: number } },
  indicies: number[] | undefined = undefined
): Buffer {
  const attrValues = Array.from(attributes.values());

  const bufferSize = attrValues.reduce(
    (size, attribute) => size + attribute.data.length,
    0
  );
  const stride = attrValues.reduce(
    (stride, attribute) => stride + attribute.components,
    0
  );

  const array = new Array(bufferSize);
  const bufferAttributes = new Map<
    string,
    { offset: number; components: number }
  >();
  let offset = 0;

  for (const name of attributes.keys()) {
    const attr = attributes.get(name);

    bufferAttributes.set(name, {
      offset: offset,
      components: attr.components
    });

    offset += attr.components;

    let writeIndex = 0;
    for (let i = 0; i < attr.data.length; i++) {
      array[writeIndex] = attr.data[i];

      const strideFactor = i === 0 || i % attr.components > 1 ? 0 : 1;

      if (i === 0 || i % attr.components > 0) {
        writeIndex++;
      } else {
        writeIndex;
      }
      writeIndex += stride * strideFactor;
    }
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(Cube.positions),
    gl.STATIC_DRAW
  );

  return { buffer, attributes: {} };
}

function bindBufferAndProgram(gl: WebGLRenderingContext, buffer: Buffer) {}

function drawScene(
  gl: WebGLRenderingContext,
  programInfo: any,
  buffers: Buffer
) {
  // {
  //   const numComponents = 3;
  //   const type = gl.FLOAT;
  //   const normalize = false;
  //   const stride = 0;
  //   const offset = 0;
  //   gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  //   gl.vertexAttribPointer(
  //     programInfo.attributes.position,
  //     numComponents,
  //     type,
  //     normalize,
  //     stride,
  //     offset
  //   );
  //   gl.enableVertexAttribArray(programInfo.attributes.position);
  // }
  // {
  //   const numComponents = 4;
  //   const type = gl.FLOAT;
  //   const normalize = false;
  //   const stride = 0;
  //   const offset = 0;
  //   gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  //   gl.vertexAttribPointer(
  //     programInfo.attributes.color,
  //     numComponents,
  //     type,
  //     normalize,
  //     stride,
  //     offset
  //   );
  //   gl.enableVertexAttribArray(programInfo.attributes.color);
  // }
  // {
  //   const numComponents = 2;
  //   const type = gl.FLOAT;
  //   const normalize = false;
  //   const stride = 0;
  //   const offset = 0;
  //   gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texcoord);
  //   gl.vertexAttribPointer(
  //     programInfo.attributes.texcoord,
  //     numComponents,
  //     type,
  //     normalize,
  //     stride,
  //     offset
  //   );
  //   gl.enableVertexAttribArray(programInfo.attributes.texcoord);
  // }
  // {
  //   const numComponents = 3;
  //   const type = gl.FLOAT;
  //   const normalize = false;
  //   const stride = 0;
  //   const offset = 0;
  //   gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
  //   gl.vertexAttribPointer(
  //     programInfo.attributes.normal,
  //     numComponents,
  //     type,
  //     normalize,
  //     stride,
  //     offset
  //   );
  //   gl.enableVertexAttribArray(programInfo.attributes.normal);
  // }
  // {
  //   const numComponents = 3;
  //   const type = gl.FLOAT;
  //   const normalize = false;
  //   const stride = 0;
  //   const offset = 0;
  //   gl.bindBuffer(gl.ARRAY_BUFFER, buffers.tangent);
  //   gl.vertexAttribPointer(
  //     programInfo.attributes.tangent,
  //     numComponents,
  //     type,
  //     normalize,
  //     stride,
  //     offset
  //   );
  //   gl.enableVertexAttribArray(programInfo.attributes.tangent);
  // }
  // gl.useProgram(programInfo.program);
  // {
  //   gl.activeTexture(gl.TEXTURE0);
  //   gl.bindTexture(gl.TEXTURE_2D, texture);
  //   gl.uniform1i(programInfo.uniforms.uSampler, 0);
  // }
  // {
  //   gl.activeTexture(gl.TEXTURE1);
  //   gl.bindTexture(gl.TEXTURE_2D, textureNormal);
  //   gl.uniform1i(programInfo.uniforms.uSamplerB, 1);
  // }
  // gl.uniform1f(programInfo.uniforms.time, time);
  // gl.uniformMatrix4fv(
  //   programInfo.uniforms.uProjectionMatrix,
  //   false,
  //   projectionMatrix
  // );
  // gl.uniformMatrix4fv(
  //   programInfo.uniforms.uModelViewMatrix,
  //   false,
  //   modelViewMatrix
  // );
  // gl.uniform3fv(programInfo.uniforms.uLightPosition, light.position);
  // console.log(light.position);
  // {
  //   const offset = 0;
  //   const vertexCount = 4;
  //   gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  // }
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
