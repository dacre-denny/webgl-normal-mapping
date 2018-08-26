import { mat4, vec3 } from "gl-matrix";
import * as shader from "./shader";
import * as textures from "./texture";
import * as geometry from "./geometry";

import * as cube from "./cube.json";

const camera = {
  position: vec3.create(),
  lookat: vec3.create()
};

camera.position.set([1, 1, 5]);
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

  const cubeShader = await shader.loadProgram(
    gl,
    "./shaders/basic.vs",
    "./shaders/basic.fs"
  );

  const axisShader = await shader.loadProgram(
    gl,
    "./shaders/axis.vs",
    "./shaders/axis.fs"
  );

  const axisGeometry = geometry.createInterleavedBuffer(
    gl,
    {
      position: {
        components: 3,
        data: [0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 5]
      },
      color: {
        components: 3,
        data: [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1]
      }
    },
    [0, 1, 2, 3, 4, 5]
  );

  const cubeGeometry = geometry.createInterleavedBuffer(
    gl,
    {
      position: {
        components: 3,
        data: cube.position
      },
      normal: {
        components: 3,
        data: cube.normal
      },
      texcoord: {
        components: 2,
        data: cube.texcoord
      },
      tangent: {
        components: 3,
        data: cube.tangent
      }
    },
    cube.indices
  );

  const modelViewMatrix = mat4.create();
  mat4.lookAt(modelViewMatrix, camera.position, camera.lookat, [0, 1, 0]);

  let time = 0.0;

  function render() {
    time += 0.01;

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

    /***/
    gl.useProgram(cubeShader.program);

    shader.updateUniforms(gl, cubeShader, {
      uSamplerB: textureNormal,
      uSampler: texture,
      time: time,
      uProjectionMatrix: projectionMatrix,
      uModelViewMatrix: modelViewMatrix,
      uLightPosition: light.position
    });

    geometry.bindBufferAndProgram(gl, cubeShader, cubeGeometry);

    geometry.drawBuffer(gl, cubeGeometry);
    ///

    gl.useProgram(axisShader.program);

    shader.updateUniforms(gl, axisShader, {
      uSamplerB: textureNormal,
      uSampler: texture,
      time: time,
      uProjectionMatrix: projectionMatrix,
      uModelViewMatrix: modelViewMatrix,
      uLightPosition: light.position
    });

    geometry.bindBufferAndProgram(gl, axisShader, axisGeometry);

    geometry.drawBuffer(gl, axisGeometry, gl.LINES);

    ///

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
