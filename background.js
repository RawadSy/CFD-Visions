const canvas = document.getElementById("bg");
const renderer = new THREE.WebGLRenderer({canvas, alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const particles = new THREE.BufferGeometry();
const count = 2000;
const positions = new Float32Array(count*3);
const colors = new Float32Array(count*3);

for (let i=0; i<count; i++) {
  positions[i*3] = (Math.random()-0.5)*10;
  positions[i*3+1] = (Math.random()-0.5)*10;
  positions[i*3+2] = (Math.random()-0.5)*10;

  const temp = Math.random();
  colors[i*3]   = temp;       // red
  colors[i*3+1] = 0.1;        // green
  colors[i*3+2] = 1.0-temp;   // blue
}
particles.setAttribute("position", new THREE.BufferAttribute(positions,3));
particles.setAttribute("color", new THREE.BufferAttribute(colors,3));

const material = new THREE.PointsMaterial({size:0.05, vertexColors:true});
const pointCloud = new THREE.Points(particles, material);
scene.add(pointCloud);

function animate() {
  requestAnimationFrame(animate);
  pointCloud.rotation.y += 0.0008;
  pointCloud.rotation.x += 0.0004;
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize",()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
