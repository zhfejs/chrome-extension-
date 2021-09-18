<!--
 * @Description: 
 * @Autor: zhenghui
 * @Date: 2021-09-15 14:52:16
-->

<script setup>
  import * as THREE from 'three';
  import { nextTick } from 'vue';

  const props = defineProps({
    amountX: {
      type: Number,
      default: 50,
    },
    amountY: {
      type: Number,
      default: 50,
    },
    color: {
      type: Number,
      default: 0xffffff,
    },
    top: {
      type: Number,
      default: 50,
    },
  });

  const state = {
    count: 0,
    // 用来跟踪鼠标水平位置
    mouseX: 0,
    windowHalfX: null,
    // 相机
    camera: null,
    // 场景
    scene: null,
    // 批量管理粒子
    particles: null,
    // 渲染器
    renderer: null,
  };

  const init = () => {
    const SEPARATION = 100;
    const SCREEN_WIDTH = window.innerWidth;
    const SCREEN_HEIGHT = window.innerHeight;
    const container = document.createElement('div');
    state.windowHalfX = window.innerWidth / 2;
    container.style.position = 'relative';
    container.style.top = `${props.top}px`;
    container.style.height = `${SCREEN_HEIGHT - props.top}px`;
    document.getElementById('indexLizi').appendChild(container);

    state.camera = new THREE.PerspectiveCamera(
      75,
      SCREEN_WIDTH / SCREEN_HEIGHT,
      1,
      10000
    );
    state.camera.position.z = 1000;

    state.scene = new THREE.Scene();

    const numParticles = props.amountX * props.amountY;
    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);
    // 初始化粒子位置和大小
    let i = 0;
    let j = 0;
    for (let ix = 0; ix < props.amountX; ix++) {
      for (let iy = 0; iy < props.amountY; iy++) {
        positions[i] = ix * SEPARATION - (props.amountX * SEPARATION) / 2;
        positions[i + 1] = 0;
        positions[i + 2] = iy * SEPARATION - (props.amountY * SEPARATION) / 2;
        scales[j] = 1;
        i += 3;
        j++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('scale', new THREE.BufferAttribute(scales, 1));
    // 初始化粒子材质
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(props.color) },
      },
      vertexShader: `
          attribute float scale;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4( position, 2.0 );
            gl_PointSize = scale * ( 300.0 / - mvPosition.z );
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
      fragmentShader: `
          uniform vec3 color;
          void main() {
            if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
            gl_FragColor = vec4( color, 1.0 );
          }
        `,
    });

    state.particles = new THREE.Points(geometry, material);
    state.scene.add(state.particles);

    state.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    state.renderer.setSize(container.clientWidth, container.clientHeight);
    state.renderer.setPixelRatio(window.devicePixelRatio);
    state.renderer.setClearAlpha(0);
    container.appendChild(state.renderer.domElement);

    window.addEventListener('resize', onWindowResize, { passive: false });
    document.addEventListener('mousemove', onDocumentMouseMove, {
      passive: false,
    });
    document.addEventListener('touchstart', onDocumentTouchStart, {
      passive: false,
    });
    document.addEventListener('touchmove', onDocumentTouchMove, {
      passive: false,
    });
  };

  const render = () => {
    state.camera.position.x += (state.mouseX - state.camera.position.x) * 0.05;
    state.camera.position.y = 400;
    state.camera.lookAt(state.scene.position);
    const positions = state.particles.geometry.attributes.position.array;
    const scales = state.particles.geometry.attributes.scale.array;
    // 计算粒子位置及大小
    let i = 0;
    let j = 0;
    for (let ix = 0; ix < props.amountX; ix++) {
      for (let iy = 0; iy < props.amountY; iy++) {
        positions[i + 1] =
          Math.sin((ix + state.count) * 0.3) * 100 +
          Math.sin((iy + state.count) * 0.5) * 100;
        scales[j] =
          (Math.sin((ix + state.count) * 0.3) + 1) * 8 +
          (Math.sin((iy + state.count) * 0.5) + 1) * 8;
        i += 3;
        j++;
      }
    }
    // 重新渲染粒子
    state.particles.geometry.attributes.position.needsUpdate = true;
    state.particles.geometry.attributes.scale.needsUpdate = true;
    state.renderer.render(state.scene, state.camera);
    state.count += 0.1;
  };
  const animate = () => {
    requestAnimationFrame(animate);
    render();
  };

  function onDocumentMouseMove(event) {
    state.mouseX = event.clientX - state.windowHalfX;
  }

  function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
      state.mouseX = event.touches[0].pageX - state.windowHalfX;
    }
  }

  function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
      event.preventDefault();
      state.mouseX = event.touches[0].pageX - state.windowHalfX;
    }
  }

  function onWindowResize() {
    state.windowHalfX = window.innerWidth / 2;
    state.camera.aspect = window.innerWidth / window.innerHeight;
    state.camera.updateProjectionMatrix();
    state.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  nextTick(() => {
    init();
    animate();
  });
</script>
<template>
  <div id="indexLizi" class="particle" />
</template>
<style scoped>
.particle {
  pointer-events:none
}
</style>
