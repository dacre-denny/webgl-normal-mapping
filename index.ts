import { mat4, mat2, vec3, vec2 } from "gl-matrix";
import * as shader from "./shader";
import * as textures from "./texture";
import * as geometry from "./geometry";

import cube from "./cube";

const camera = {
  position: vec3.create(),
  lookat: vec3.create()
};

camera.position.set([1, 2, 5]);
camera.lookat.set([0, 0, 0]);

const light = {
  position: vec3.create()
};
light.position.set([2, 2, 0]);
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
    vec3.rotateY(camera.position, camera.position, camera.lookat, t);
  } else {
    vec3.rotateY(light.position, light.position, [0, 0, 0], t);

    light.position[1] = Math.sin(event.clientX * 0.03) * 3;
  }
});

function computeTangent(
  v1: vec3,
  v2: vec3,
  v3: vec3,
  w1: vec2,
  w2: vec2,
  w3: vec2
): vec3 {
  const x1 = v2[0] - v1[0];
  const x2 = v3[0] - v1[0];
  const y1 = v2[1] - v1[1];
  const y2 = v3[1] - v1[1];
  const z1 = v2[2] - v1[2];
  const z2 = v3[2] - v1[2];

  const s1 = w2[0] - w1[0];
  const s2 = w3[0] - w1[0];
  const t1 = w2[1] - w1[1];
  const t2 = w3[1] - w1[1];

  const r = 1.0 / (s1 * t2 - s2 * t1);

  const t = vec3.create();
  const s = vec3.create();

  vec3.set(
    t,
    (s1 * x2 - s2 * x1) * r,
    (s1 * y2 - s2 * y1) * r,
    (s1 * z2 - s2 * z1) * r
  );

  vec3.set(
    s,
    (t2 * x1 - t1 * x2) * r,
    (t2 * y1 - t1 * y2) * r,
    (t2 * z1 - t1 * z2) * r
  );

  const tnorm = vec3.create();
  const bnorm = vec3.create();
  const nnorm = vec3.create();

  vec3.normalize(tnorm, t);
  vec3.normalize(bnorm, s);
  vec3.cross(nnorm, tnorm, bnorm);

  console.log(`
  v1 ${v1}
  v2 ${v2}
  v3 ${v3}
  --
  w1 ${w1}
  w2 ${w2}
  w3 ${w3}
  --
  t ${tnorm}
  b ${bnorm}
  n ${nnorm}
  `);

  // vec3.set(tnorm, 0, 1, 0);
  return tnorm;
}

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

  // cube.indices = [0, 1, 2, 0, 2, 3].map(x => x + 16);

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

    const tangent = computeTangent(v0, v1, v2, w0, w1, w2);

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
      uProjectionMatrix: projectionMatrix,
      uModelViewMatrix: modelViewMatrix
    });

    geometry.bindBufferAndProgram(gl, axisShader, axisGeometry);

    geometry.drawBuffer(gl, axisGeometry, gl.LINES);

    ///

    const lightTranslation = mat4.create();
    mat4.fromTranslation(lightTranslation, light.position);

    mat4.multiply(modelViewMatrix, modelViewMatrix, lightTranslation);

    shader.updateUniforms(gl, axisShader, {
      uProjectionMatrix: projectionMatrix,
      uModelViewMatrix: modelViewMatrix
    });

    geometry.bindBufferAndProgram(gl, axisShader, lightGeometry);

    geometry.drawBuffer(gl, lightGeometry, gl.LINES);
    ///

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
