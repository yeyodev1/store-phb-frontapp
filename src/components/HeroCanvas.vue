<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'

const canvas = ref<HTMLCanvasElement | null>(null)

let renderer: THREE.WebGLRenderer | null = null
let raf = 0
let cleanup: (() => void) | null = null

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float u_time;
  uniform float u_scroll;
  uniform vec2 u_mouse;
  uniform vec2 u_res;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0; float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 6; i++){ v += a * noise(p); p = m * p; a *= 0.5; }
    return v;
  }

  void main(){
    float aspect = u_res.x / u_res.y;
    vec2 uv = vUv;
    vec2 p = vec2(uv.x * aspect, uv.y) * 3.0;
    p.y -= u_time * 0.05;

    vec2 q = vec2(fbm(p + vec2(0.0, u_time * 0.08)), fbm(p + vec2(5.2, 1.3)));
    vec2 r = vec2(fbm(p + 2.0 * q + vec2(1.7, 9.2) + u_time * 0.06),
                  fbm(p + 2.0 * q + vec2(8.3, 2.8)));
    float f = fbm(p + 2.0 * r);

    vec2 m = vec2(u_mouse.x * aspect, u_mouse.y);
    vec2 pa = vec2(uv.x * aspect, uv.y);
    float md = distance(pa, m);
    f += (0.06 / (md + 0.09)) * 0.12;

    vec3 navy = vec3(0.004, 0.050, 0.153);
    vec3 blue = vec3(0.126, 0.580, 0.830);
    vec3 cyan = vec3(0.094, 0.905, 0.940);

    vec3 col = mix(navy, blue, smoothstep(0.18, 0.72, f));
    col = mix(col, cyan, smoothstep(0.74, 0.96, f + r.x * 0.2));
    float caustic = pow(max(f, 0.0), 3.0);
    col += cyan * caustic * 0.45;

    col = mix(col, navy, clamp(u_scroll, 0.0, 1.0) * 0.65);

    float vig = smoothstep(1.25, 0.35, length(uv - 0.5));
    col *= 0.55 + 0.45 * vig;

    gl_FragColor = vec4(col, 1.0);
  }
`

onMounted(() => {
  const el = canvas.value
  if (!el) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: false })
  renderer.setClearColor(0x010d27, 1)

  const uniforms = {
    u_time: { value: 0 },
    u_scroll: { value: 0 },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    u_res: { value: new THREE.Vector2(1, 1) },
  }

  const material = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
  scene.add(mesh)

  function resize() {
    const w = el!.clientWidth
    const h = el!.clientHeight
    renderer!.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer!.setSize(w, h, false)
    uniforms.u_res.value.set(w, h)
  }
  resize()

  const targetMouse = new THREE.Vector2(0.5, 0.5)
  function onPointer(e: PointerEvent) {
    const rect = el!.getBoundingClientRect()
    targetMouse.set((e.clientX - rect.left) / rect.width, 1 - (e.clientY - rect.top) / rect.height)
  }
  function onScroll() {
    uniforms.u_scroll.value = Math.min(1, window.scrollY / (window.innerHeight || 1))
  }

  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  const start = performance.now()
  function loop() {
    uniforms.u_time.value = (performance.now() - start) / 1000
    uniforms.u_mouse.value.lerp(targetMouse, 0.05)
    renderer!.render(scene, camera)
    if (!reduce) raf = requestAnimationFrame(loop)
  }
  loop()

  cleanup = () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('scroll', onScroll)
    mesh.geometry.dispose()
    material.dispose()
    renderer?.dispose()
  }
})

onUnmounted(() => cleanup?.())
</script>

<template>
  <canvas ref="canvas" class="hero-canvas" aria-hidden="true"></canvas>
</template>

<style scoped lang="scss">
.hero-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
