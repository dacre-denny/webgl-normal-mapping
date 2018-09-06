import * as _ from "lodash";

const FLOAT = 0x1406;
const FLOAT_VEC2 = 0x8b50;
const FLOAT_VEC3 = 0x8b51;
const FLOAT_VEC4 = 0x8b52;
const INT = 0x1404;
const INT_VEC2 = 0x8b53;
const INT_VEC3 = 0x8b54;
const INT_VEC4 = 0x8b55;
const BOOL = 0x8b56;
const BOOL_VEC2 = 0x8b57;
const BOOL_VEC3 = 0x8b58;
const BOOL_VEC4 = 0x8b59;
const FLOAT_MAT2 = 0x8b5a;
const FLOAT_MAT3 = 0x8b5b;
const FLOAT_MAT4 = 0x8b5c;
const SAMPLER_2D = 0x8b5e;
const SAMPLER_CUBE = 0x8b60;
const SAMPLER_3D = 0x8b5f;
const SAMPLER_2D_SHADOW = 0x8b62;
const FLOAT_MAT2x3 = 0x8b65;
const FLOAT_MAT2x4 = 0x8b66;
const FLOAT_MAT3x2 = 0x8b67;
const FLOAT_MAT3x4 = 0x8b68;
const FLOAT_MAT4x2 = 0x8b69;
const FLOAT_MAT4x3 = 0x8b6a;
const SAMPLER_2D_ARRAY = 0x8dc1;
const SAMPLER_2D_ARRAY_SHADOW = 0x8dc4;
const SAMPLER_CUBE_SHADOW = 0x8dc5;
const UNSIGNED_INT = 0x1405;
const UNSIGNED_INT_VEC2 = 0x8dc6;
const UNSIGNED_INT_VEC3 = 0x8dc7;
const UNSIGNED_INT_VEC4 = 0x8dc8;
const INT_SAMPLER_2D = 0x8dca;
const INT_SAMPLER_3D = 0x8dcb;
const INT_SAMPLER_CUBE = 0x8dcc;
const INT_SAMPLER_2D_ARRAY = 0x8dcf;
const UNSIGNED_INT_SAMPLER_2D = 0x8dd2;
const UNSIGNED_INT_SAMPLER_3D = 0x8dd3;
const UNSIGNED_INT_SAMPLER_CUBE = 0x8dd4;
const UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8dd7;

const TEXTURE_2D = 0x0de1;
const TEXTURE_CUBE_MAP = 0x8513;
const TEXTURE_3D = 0x806f;
const TEXTURE_2D_ARRAY = 0x8c1a;

function isWebGl(info: WebGLActiveInfo) {
  const name = info.name.toLocaleLowerCase();
  return name.startsWith("gl_") || name.startsWith("webgl_");
}

export interface Shader {
  program: WebGLProgram;
  //attributes: any;
  uniforms: any;
}

export function updateUniforms(
  gl: WebGLRenderingContext,
  shader: Shader,
  attributes: { [key: string]: any }
) {
  const n = gl.getProgramParameter(shader.program, gl.ACTIVE_UNIFORMS);
  let unit = 0;

  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(shader.program, i);
    if (isWebGl(info)) {
      continue;
    }

    const value = _.get(attributes, info.name); //[info.name];
    if (!value) {
      continue;
    }

    const location = gl.getUniformLocation(shader.program, info.name);

    switch (info.type) {
      case FLOAT: {
        gl.uniform1f(location, value);
        break;
      }
      case FLOAT_VEC2: {
        gl.uniform2fv(location, value);
        break;
      }
      case FLOAT_VEC3: {
        gl.uniform3fv(location, value);
        break;
      }
      case FLOAT_VEC4: {
        gl.uniform4fv(location, value);
        break;
      }
      case FLOAT_MAT4: {
        gl.uniformMatrix4fv(location, false, value);
        break;
      }
      case SAMPLER_2D: {
        gl.uniform1i(location, unit);

        gl.activeTexture(gl.TEXTURE0 + unit);

        gl.bindTexture(gl.TEXTURE_2D, value);

        unit++;
        break;
      }
    }
  }
}

export async function loadProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string,
  defines: string[] = []
) {
  const definitions = defines
    .map(definition => `#define ${definition}`)
    .join("\n");
  const vertexShader = await loadShader(
    gl,
    gl.VERTEX_SHADER,
    vsSource,
    definitions
  );
  const fragmentShader = await loadShader(
    gl,
    gl.FRAGMENT_SHADER,
    fsSource,
    definitions
  );

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      "Unable to initialize the shader program: " +
      gl.getProgramInfoLog(program)
    );
    return null;
  }

  return <Shader>{
    program: program
  };
}

async function loadShader(
  gl: WebGLRenderingContext,
  type: number,
  url: string,
  definitions: string = ""
) {
  const result = await fetch(url);
  const source = await result.text();

  const shader = gl.createShader(type);

  gl.shaderSource(
    shader,
    `
    ${definitions}
    ${source}
    `
  );

  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
