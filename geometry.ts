import { vec3 } from "gl-matrix";
import { Shader } from "./shader";

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
  let count = 0;

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

  let indexBuffer = undefined;

  if (indicies) {
    const indexArray = new Uint16Array(indicies);
    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArray, gl.STATIC_DRAW);

    count = indicies.length / 3;
  } else {
    count = size / stride;
  }

  return {
    buffer,
    attributes: output,
    stride,
    count,
    indices: indexBuffer
  };
}

export function bindBufferAndProgram(
  gl: WebGLRenderingContext,
  shader: Shader,
  geometry: Geometry
) {
  gl.bindBuffer(gl.ARRAY_BUFFER, geometry.buffer);

  for (const name in geometry.attributes) {
    const attribute = geometry.attributes[name];

    const index = gl.getAttribLocation(shader.program, name);

    gl.vertexAttribPointer(
      index,
      attribute.components,
      gl.FLOAT,
      false,
      geometry.stride * Float32Array.BYTES_PER_ELEMENT,
      attribute.offset * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(index);
  }

  if (geometry.indices) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.indices);
  }

  gl.useProgram(shader.program);
}

export function drawBuffer(gl: WebGLRenderingContext, geometry: Geometry) {
  if (geometry.indices) {
    gl.drawElements(gl.TRIANGLES, geometry.count * 3, gl.UNSIGNED_SHORT, 0);
  } else {
    gl.drawArrays(gl.TRIANGLES, 0, geometry.count);
  }
}
