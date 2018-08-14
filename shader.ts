export interface Shader {
  program: WebGLProgram;
  attributes: any;
  uniforms: any;
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
