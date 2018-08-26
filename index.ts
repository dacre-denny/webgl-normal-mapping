import { mat4, vec3 } from "gl-matrix";
import * as shader from "./shader";
import * as textures from "./texture";
import * as geometry from "./geometry";

const camera = {
  position: vec3.create(),
  lookat: vec3.create()
};

camera.position.set([0, 0, 3]);
camera.lookat.set([0, 0, 0]);

const light = {
  position: vec3.create()
};
light.position.set([1.5, 0, 0]);
/*
document.addEventListener("keydown", event => {
  switch (event.keyCode) {
    case 87: {
      const v = [0, 0, 0];

      vec3.subtract(v, camera.lookat, camera.position);
      vec3.scale(v, v, 0.1);
      vec3.add(camera.position, camera.position, v);

      break;
    }
    case 83: {
      const v = [0, 0, 0];

      vec3.subtract(v, camera.lookat, camera.position);
      vec3.scale(v, v, -0.1);
      vec3.add(camera.position, camera.position, v);

      break;
    }
  }
});

*/
document.addEventListener("mousemove", (event: MouseEvent) => {
  const t = (5 * event.movementX) / document.body.clientWidth;

  if (event.buttons > 0) {
    vec3.rotateY(camera.position, camera.position, camera.lookat, t);
  } else {
    vec3.rotateY(light.position, light.position, [0, 0, 0], t);
  }
});

async function main() {
  const canvas = document.querySelector("canvas");
  const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

  if (gl === null) {
    console.error(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  const texture = await textures.loadTexture(gl, "./textures/metal-color.png");
  const textureNormal = await textures.loadTexture(
    gl,
    "./textures/metal-normal.png"
  );

  const shaderProgram = await shader.loadProgram(
    gl,
    "./shaders/basic.vs",
    "./shaders/basic.fs"
    //["position", "color", "texcoord", "normal", "tangent"],
    // [
    //   "uProjectionMatrix",
    //   "uModelViewMatrix",
    //   "uSampler",
    //   "uSamplerB",
    //   "time",
    //   "uLightPosition"
    // ]
  );

  const quad = geometry.createInterleavedBuffer(
    gl,
    {
      position: {
        components: 3,
        data: [-0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, -0.5, 0, -0.5, -0.5, 0]
      },
      normal: {
        components: 3,
        data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]
      },
      texcoord: { components: 2, data: [0, 0, 1, 0, 1, 1, 0, 1] },
      tangent: { components: 3, data: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0] }
    },
    [0, 1, 2, 0, 2, 3]
  );

  geometry.bindBufferAndProgram(gl, shaderProgram, quad);
  geometry.drawBuffer(gl, quad);

  const modelViewMatrix = mat4.create();
  mat4.lookAt(modelViewMatrix, camera.position, camera.lookat, [0, 1, 0]);

  // shader.updateUniforms(gl, shaderProgram, {
  //   uModelViewMatrix: modelViewMatrix
  // });

  // const buffers = initBuffers(gl);
  let time = 0.0;

  function render() {
    time += 0.01;

    //drawScene(gl, shaderProgram, buffers, texture, textureNormal, (t += 0.01));

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const modelViewMatrix = mat4.create();
    mat4.lookAt(modelViewMatrix, camera.position, camera.lookat, [0, 1, 0]);

    const modelRotation = mat4.create();
    mat4.fromZRotation(modelRotation, time);

    gl.useProgram(shaderProgram.program);

    shader.updateUniforms(gl, shaderProgram, {
      uSampler: texture,
      uSamplerB: textureNormal,
      time: time,
      uProjectionMatrix: projectionMatrix,
      uModelViewMatrix: modelViewMatrix,
      uLightPosition: light.position
    });
    /*
    (() => {

      const n = gl.getProgramParameter(shaderProgram.program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const info = gl.getActiveUniform(shaderProgram.program, i);
            
        const value = attributes[info.name];
        if (!value) {
          continue;
        }
    
        const uniformSetter = types[info.type] as any;
    
        if (uniformSetter) {
          const index = gl.getUniformLocation(shaderProgram.program, info.name);
          uniformSetter(index, value);
        }
      }
    })()

    gl.uniform1f(shaderProgram.uniforms.time, time);

    gl.uniformMatrix4fv(
      shaderProgram.uniforms.uProjectionMatrix,
      false,
      projectionMatrix
    );
    gl.uniformMatrix4fv(
      shaderProgram.uniforms.uModelViewMatrix,
      false,
      modelViewMatrix
    );
    gl.uniform3fv(shaderProgram.uniforms.uLightPosition, light.position);
    */

    geometry.bindBufferAndProgram(gl, shaderProgram, quad);

    geometry.drawBuffer(gl, quad);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
