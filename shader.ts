import { mat3, mat4, vec2, vec3, vec4 } from "gl-matrix";

export interface Shader {
  program: WebGLProgram;
  attributes: any;
  uniforms: any;
}

export type UniformType = mat3 | mat4 | vec2 | vec3 | vec4 | number;

export function updateUniforms(
  gl: WebGL2RenderingContext,
  shader: Shader,
  attributes: { [key: string]: UniformType }
) {
  for (const name in attributes) {
    const value = attributes[name];
    const index = gl.getUniformLocation(shader.program, name);

    if (value instanceof mat3) {
      gl.uniformMatrix3fv(index, false, value as mat3);
      continue;
    }
    if (value instanceof mat4) {
      gl.uniformMatrix4fv(index, false, value as mat4);
      continue;
    }
    if (value instanceof Number) {
      gl.uniform1f(index, value as number);
      continue;
    }
    if (value instanceof vec2) {
      gl.uniform2fv(index, value as vec2);
      continue;
    }
    if (value instanceof vec3) {
      gl.uniform3fv(index, value as vec3);
      continue;
    }
    if (value instanceof vec4) {
      gl.uniform4fv(index, value as vec4);
      continue;
    }
  }
}

export async function loadProgram(
  gl: WebGL2RenderingContext,
  vsSource: string,
  fsSource: string,
  attributeNames: string[],
  uniformNames: string[]
) {
  const vertexShader = await loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = await loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

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
  /*
  //gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (
    let i = 0;
    i < gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    i++
  ) {
    const attributeInfo = gl.getActiveAttrib(program, i);
    debugger;
  }
*/
  const attributes: any = {};
  const uniforms: any = {};

  attributeNames.forEach(attribute => {
    attributes[attribute] = gl.getAttribLocation(program, attribute);
  });

  uniformNames.forEach(uniform => {
    uniforms[uniform] = gl.getUniformLocation(program, uniform);
  });

  return <Shader>{
    program: program,
    attributes: attributes,
    uniforms: uniforms
  };
}

async function loadShader(
  gl: WebGL2RenderingContext,
  type: number,
  url: string
) {
  const result = await fetch(url);
  const source = await result.text();

  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
