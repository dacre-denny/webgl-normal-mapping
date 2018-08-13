// import * as dacre from './dacre.ts'


export async function loadProgram(gl, vsSource, fsSource, attributes, uniforms) {

    const vertexShader = await loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = await loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to1 initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    } 
    
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
          lightPosition: gl.getUniformLocation(shaderProgram, 'uLightPosition'),
        },
      }

    return shaderProgram;
}

async function loadShader(gl, type, url) {

    const result = await fetch(url)
    const source = await result.text()

    const shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}