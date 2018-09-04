import { mat4, mat2, vec3, vec2 } from "gl-matrix";
import * as shader from "./shader";
import * as textures from "./texture";
import * as geometry from "./geometry";
import camera from "./camera";

const camerax = camera.Create();

camerax.setPosition(1, 2, 5);
camerax.setDirection(0, 0, 0);

import cube from "./cube";

const cameraOld = {
  position: vec3.create(),
  lookat: vec3.create()
};

cameraOld.position.set([1, 2, 5]);
cameraOld.lookat.set([0, 0, 0]);

const lights = [
  {
    position: vec3.create(),
    color: vec3.create(),
    range: 1.0
  },
  {
    position: vec3.create(),
    color: vec3.create(),
    range: 1.0
  }
];

lights[0].position.set([2, 1, 2]);
lights[0].color.set([0.85, 0.95, 1]);
lights[1].position.set([2, 1, 2]);
lights[1].color.set([0.85, 0.95, 1]);
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
  const t = (15 * event.movementX) / document.body.clientWidth;

  if (event.buttons > 0) {
    vec3.rotateY(cameraOld.position, cameraOld.position, cameraOld.lookat, t);
  } else {
    // vec3.rotateY(light.position, light.position, [0, 0, 0], t);
    // light.position[1] = Math.sin(event.clientX * 0.03) * 3;
  }
});

async function main() {
  const canvas = document.querySelector("canvas");
  canvas.addEventListener("contextmenu", event => event.preventDefault());
  const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

  if (gl === null) {
    console.error(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  const textureColor = await textures.loadTexture(
    gl,
    "./textures/EC_Stone_Wall_D.jpg"
  );
  const textureNormal = await textures.loadTexture(
    gl,
    "./textures/EC_Stone_Wall_Normal.jpg"
  );

  const cubeShader = await shader.loadProgram(
    gl,
    "./shaders/basic.vs",
    "./shaders/basic.fs",
    ["LIGHTS 2"]
  );

  const simpleShader = await shader.loadProgram(
    gl,
    "./shaders/simple.vs",
    "./shaders/simple.fs"
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

  const lightGeometry = geometry.createInterleavedBuffer(
    gl,
    {
      position: {
        components: 3,
        data: [
          -0.1,
          0,
          0,
          0.1,
          0,
          0,
          0,
          -0.1,
          0,
          0,
          0.1,
          0,
          0,
          0,
          -0.1,
          0,
          0,
          0.1
        ]
      },
      color: {
        components: 3,
        data: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0]
      }
    },
    [0, 1, 2, 3, 4, 5]
  );

  for (var i = 0; i < cube.indices.length; i += 3) {
    const i0 = cube.indices[i + 0];
    const i1 = cube.indices[i + 1];
    const i2 = cube.indices[i + 2];

    const pos = (idx: number) => {
      const v = vec3.create();
      vec3.set(
        v,
        cube.position[idx * 3 + 0],
        cube.position[idx * 3 + 1],
        cube.position[idx * 3 + 2]
      );
      return v;
    };

    const tex = (idx: number) => {
      const v = vec2.create();
      vec2.set(v, cube.texcoord[idx * 2 + 0], cube.texcoord[idx * 2 + 1]);
      return v;
    };

    const v0 = pos(i0);
    const v1 = pos(i1);
    const v2 = pos(i2);

    const w0 = tex(i0);
    const w1 = tex(i1);
    const w2 = tex(i2);

    const tangent = geometry.computeTangent(v0, v1, v2, w0, w1, w2);

    cube.tangent[i0 * 3 + 0] = tangent[0];
    cube.tangent[i0 * 3 + 1] = tangent[1];
    cube.tangent[i0 * 3 + 2] = tangent[2];

    cube.tangent[i1 * 3 + 0] = tangent[0];
    cube.tangent[i1 * 3 + 1] = tangent[1];
    cube.tangent[i1 * 3 + 2] = tangent[2];

    cube.tangent[i2 * 3 + 0] = tangent[0];
    cube.tangent[i2 * 3 + 1] = tangent[1];
    cube.tangent[i2 * 3 + 2] = tangent[2];
  }

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
  mat4.lookAt(modelViewMatrix, cameraOld.position, cameraOld.lookat, [0, 1, 0]);

  let time = 0.0;

  function renderLights(projectionMatrix: mat4) {
    shader.updateUniforms(gl, simpleShader, {
      uProjectionMatrix: projectionMatrix,
      uViewMatrix: modelViewMatrix
    });

    const lightTranslation = mat4.create();

    for (const light of lights) {
      mat4.fromTranslation(lightTranslation, light.position);

      shader.updateUniforms(gl, simpleShader, {
        uWorldMatrix: lightTranslation
      });

      geometry.bindBufferAndProgram(gl, simpleShader, lightGeometry);

      geometry.drawBuffer(gl, lightGeometry, gl.LINES);
    }
  }

  function render() {
    time += 0.01;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = (70 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const modelRotation = mat4.create();
    mat4.fromTranslation(modelRotation, [Math.sin(time) * 1, 0, 0]);

    mat4.rotateZ(modelRotation, modelRotation, time);
    //mat4.fromZRotation(modelRotation, time);
    // mat4.multiply(modelRotation, mat4.fromZRotation(mat4.create()), time);

    const modelViewMatrix = mat4.create();
    mat4.lookAt(modelViewMatrix, cameraOld.position, cameraOld.lookat, [
      0,
      1,
      0
    ]);

    /***/
    gl.useProgram(cubeShader.program);

    shader.updateUniforms(gl, cubeShader, {
      lights: lights,
      uTextureNormal: textureNormal,
      uTextureColor: textureColor,
      uProjectionMatrix: projectionMatrix,
      uViewMatrix: modelViewMatrix,
      uViewPosition: cameraOld.position,
      uWorldMatrix: modelRotation
    });

    lights[0].position[0] = Math.sin(time) * 2;
    lights[0].position[1] = Math.sin(time * 0.5) * 2;
    lights[0].position[2] = Math.cos(time) * 2;

    lights[1].position[0] = Math.sin(0.5 + time) * 2;
    lights[1].position[1] = Math.sin(0.5 + time * 0.5) * 2;
    lights[1].position[2] = Math.cos(0.5 + time) * 2;

    lights[0].color[0] = 0.0;
    lights[0].color[1] = 0.0;
    lights[0].color[2] = 1.0;

    lights[1].color[0] = 1.0;
    lights[1].color[1] = 0.0;
    lights[1].color[2] = 0.0;

    geometry.bindBufferAndProgram(gl, cubeShader, cubeGeometry);

    geometry.drawBuffer(gl, cubeGeometry);
    ///
    const identity = mat4.create();
    mat4.identity(identity);

    gl.useProgram(simpleShader.program);

    shader.updateUniforms(gl, simpleShader, {
      uProjectionMatrix: projectionMatrix,
      uViewMatrix: modelViewMatrix,
      uWorldMatrix: identity
    });

    geometry.bindBufferAndProgram(gl, simpleShader, axisGeometry);

    geometry.drawBuffer(gl, axisGeometry, gl.LINES);

    ///
    renderLights(projectionMatrix);
    ///

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
