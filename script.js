// Animated background using Three.js particles for heat/mass transfer & fluid flow effect
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.module.js';

let scene, camera, renderer, particles;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('background').appendChild(renderer.domElement);

  const geometry = new THREE.BufferGeometry();
  const particlesCount = 2000;
  const positions = [];
  for (let i = 0; i < particlesCount; i++) {
    positions.push((Math.random() - 0.5) * 100);
    positions.push((Math.random() - 0.5) * 100);
    positions.push((Math.random() - 0.5) * 100);
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({ color: 0x00aaff, size: 0.5, transparent: true });
  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  camera.position.z = 50;
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.001;
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();