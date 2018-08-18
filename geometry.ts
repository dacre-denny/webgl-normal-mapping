import { vec3 } from "gl-matrix";
import { Shader } from "./shader";
import * as Cube from "./cube.json";

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

interface Geometry {
  attributes: { [key: string]: { offset: number; components: number } };
  stride: number;
  count: number;
  buffer: WebGLBuffer;
  indices?: WebGLBuffer;
}

function getAttributesInfo(attributes: {
  [key: string]: { data: number[]; components: number };
}): { size: number; stride: number } {
  let stride = 0;
  let size = 0;

  for (const name in attributes) {
    const { components, data } = attributes[name];
    stride += components;
    size += data.length;
  }

  return { stride, size };
}

export function createInterleavedBuffer(
  gl: WebGL2RenderingContext,
  attributes: { [key: string]: { data: number[]; components: number } },
  indicies: number[] | undefined = undefined
): Geometry {
  const { stride, size } = getAttributesInfo(attributes);
  const output: { [key: string]: { offset: number; components: number } } = {};
  const array = new Float32Array(size);
  let offset = 0;

  for (const name in attributes) {
    const attribute = attributes[name];
    let writeIdx = offset;

    output[name] = { offset, components: attribute.components };

    for (let i = 0; i < attribute.data.length; i++) {
      array[writeIdx] = attribute.data[i];
      if (i % attribute.components === attribute.components - 1) {
        writeIdx += stride - attribute.components + 1;
      } else {
        writeIdx++;
      }
    }
    offset += attribute.components;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

  return { buffer, attributes: output, stride, count: size / stride };
}

export function bindBufferAndProgram(
  gl: WebGLRenderingContext,
  shader: Shader,
  geometry: Geometry
) {
  debugger;
  gl.bindBuffer(gl.ARRAY_BUFFER, geometry.buffer);

  for (const name in geometry.attributes) {
    const attribute = geometry.attributes[name];

    const index = gl.getAttribLocation(shader.program, name);

    gl.vertexAttribPointer(
      index,
      attribute.components,
      gl.FLOAT,
      false,
      geometry.stride,
      attribute.offset
    );

    gl.enableVertexAttribArray(index);
  }

  gl.useProgram(shader.program);
}

export function drawBuffer(gl: WebGLRenderingContext, geometry: Geometry) {
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, geometry.count);

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
