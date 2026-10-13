
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const canvas = document.querySelector('#lunch-canvas');
const loading = document.querySelector('#loading');
const hint = document.querySelector('#tap-hint');
const message = document.querySelector('#message');
const replay = document.querySelector('#replay');

// --------------------------------------------------
// SCENE
// --------------------------------------------------

const scene = new THREE.Scene();
scene.background = new THREE.Color('#fff8f1');

const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
camera.position.set(4.2, 4.5, 6.2);
camera.lookAt(0, 0.65, 0);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'default'
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

scene.add(new THREE.HemisphereLight('#fff8ee', '#c5a397', 2.1));

const sunlight = new THREE.DirectionalLight('#fff4dc', 3.2);
sunlight.position.set(3, 7, 5);
scene.add(sunlight);

const fillLight = new THREE.DirectionalLight('#f5c6cf', 1.1);
fillLight.position.set(-4, 3, -3);
scene.add(fillLight);

// --------------------------------------------------
// MATERIALS
// --------------------------------------------------

const materials = {
  cream: new THREE.MeshStandardMaterial({
    color: '#fff0d9',
    roughness: 0.34
  }),
  pink: new THREE.MeshStandardMaterial({
    color: '#e8b7ae',
    roughness: 0.38
  }),
  darkPink: new THREE.MeshStandardMaterial({
    color: '#c98f88',
    roughness: 0.4
  }),
  white: new THREE.MeshStandardMaterial({
    color: '#fffaf0',
    roughness: 0.65
  }),
  rice: new THREE.MeshStandardMaterial({
    color: '#fffaf1',
    roughness: 0.9
  }),
  broccoli: new THREE.MeshStandardMaterial({
    color: '#6d9c59',
    roughness: 0.85
  }),
  orange: new THREE.MeshStandardMaterial({
    color: '#f3a65e',
    roughness: 0.6
  }),
  sausage: new THREE.MeshStandardMaterial({
    color: '#c86d64',
    roughness: 0.45
  }),
  yolk: new THREE.MeshStandardMaterial({
    color: '#ffc957',
    roughness: 0.45
  }),
  nori: new THREE.MeshStandardMaterial({
    color: '#354d3d',
    roughness: 0.95
  })
};

// --------------------------------------------------
// GEOMETRY HELPERS
// --------------------------------------------------

function roundedBox(parent, size, position, material, radius = 0.08) {
  const geometry = new RoundedBoxGeometry(
    size[0],
    size[1],
    size[2],
    4,
    radius
  );

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function sphere(parent, position, scale, material, segments = 24) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, segments, 16),
    material
  );

  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

// --------------------------------------------------
// GROUND
// --------------------------------------------------

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({
    color: '#fff8f1',
    roughness: 1
  })
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.04;
scene.add(ground);

// --------------------------------------------------
// LUNCH BOX
// Open-top construction: separate floor and walls.
// This avoids a solid top surface hiding the food.
// --------------------------------------------------

const lunch = new THREE.Group();
scene.add(lunch);

// Bottom of the container
roundedBox(
  lunch,
  [2.72, 0.16, 1.97],
  [0, 0.10, 0],
  materials.pink,
  0.10
);

// Four pink walls, leaving the center open
roundedBox(
  lunch,
  [2.72, 0.62, 0.15],
  [0, 0.46, -0.91],
  materials.pink,
  0.07
);

roundedBox(
  lunch,
  [2.72, 0.62, 0.15],
  [0, 0.46, 0.91],
  materials.pink,
  0.07
);

roundedBox(
  lunch,
  [0.15, 0.62, 1.72],
  [-1.285, 0.46, 0],
  materials.pink,
  0.07
);

roundedBox(
  lunch,
  [0.15, 0.62, 1.72],
  [1.285, 0.46, 0],
  materials.pink,
  0.07
);

// Cream-colored rim strips.
// These are narrow rails, not a solid slab.
roundedBox(
  lunch,
  [2.70, 0.07, 0.12],
  [0, 0.775, -0.91],
  materials.cream,
  0.035
);

roundedBox(
  lunch,
  [2.70, 0.07, 0.12],
  [0, 0.775, 0.91],
  materials.cream,
  0.035
);

roundedBox(
  lunch,
  [0.12, 0.07, 1.70],
  [-1.285, 0.775, 0],
  materials.cream,
  0.035
);

roundedBox(
  lunch,
  [0.12, 0.07, 1.70],
  [1.285, 0.775, 0],
  materials.cream,
  0.035
);

// Front clasp
roundedBox(
  lunch,
  [0.42, 0.18, 0.12],
  [0, 0.72, 1.035],
  materials.darkPink,
  0.045
);

// --------------------------------------------------
// FOOD
// Food is grouped separately so its height is easy
// to adjust without moving the box or lid.
// --------------------------------------------------

const food = new THREE.Group();
lunch.add(food);
food.position.y = -0.34;

// Smiling rice ball
const riceBall = new THREE.Group();
riceBall.position.set(-0.62, 0.87, -0.20);
food.add(riceBall);

sphere(
  riceBall,
  [0, 0.11, 0],
  [0.49, 0.25, 0.46],
  materials.rice,
  32
);

// Nori strip on the front of the rice ball
roundedBox(
  riceBall,
  [0.52, 0.10, 0.06],
  [0, 0.06, 0.405],
  materials.nori,
  0.035
);

const faceMaterial = new THREE.MeshStandardMaterial({
  color: '#49362f',
  roughness: 0.85
});

// Eyes
sphere(
  riceBall,
  [-0.13, 0.08, 0.45],
  [0.035, 0.04, 0.018],
  faceMaterial
);

sphere(
  riceBall,
  [0.13, 0.08, 0.45],
  [0.035, 0.04, 0.018],
  faceMaterial
);

// Smile
const smile = new THREE.Mesh(
  new THREE.TorusGeometry(0.07, 0.012, 8, 20, Math.PI),
  faceMaterial
);

smile.position.set(0, 0.035, 0.458);
smile.rotation.z = Math.PI;
riceBall.add(smile);

// Fried egg
sphere(
  food,
  [0.35, 0.83, -0.36],
  [0.48, 0.09, 0.39],
  materials.white,
  32
);

sphere(
  food,
  [0.32, 0.92, -0.34],
  [0.20, 0.075, 0.19],
  materials.yolk,
  28
);

// Broccoli
[
  [0.90, 0.88, 0.38, 0.15],
  [1.02, 0.89, 0.18, 0.14],
  [0.78, 0.89, 0.18, 0.14],
  [0.88, 0.96, 0.27, 0.12]
].forEach(([x, y, z, r]) => {
  sphere(
    food,
    [x, y, z],
    [r, r, r],
    materials.broccoli,
    16
  );
});

// Carrots
sphere(
  food,
  [-0.05, 0.83, 0.55],
  [0.12, 0.07, 0.11],
  materials.orange
);

sphere(
  food,
  [0.20, 0.83, 0.58],
  [0.11, 0.07, 0.10],
  materials.orange
);

// Mini sausages
function sausage(x, z, angle) {
  const item = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.085, 0.26, 4, 12),
    materials.sausage
  );

  item.position.set(x, 0.84, z);
  item.rotation.z = Math.PI / 2;
  item.rotation.y = angle;
  item.scale.set(1, 0.9, 1);
  item.castShadow = true;
  item.receiveShadow = true;
  food.add(item);
}

sausage(-0.85, 0.63, 0.15);
sausage(-0.43, 0.65, -0.2);

// --------------------------------------------------
// HEART DECORATIONS ON FRONT
// --------------------------------------------------

function makeHeartTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;

  const ctx = c.getContext('2d');
  ctx.fillStyle = '#d89591';
  ctx.font = 'bold 100px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('♥', 64, 67);

  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const heartMaterial = new THREE.MeshBasicMaterial({
  map: makeHeartTexture(),
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide
});

function addHeart(x, y, z, size) {
  const heart = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    heartMaterial
  );

  heart.position.set(x, y, z);
  lunch.add(heart);
}

addHeart(-0.92, 0.42, 0.995, 0.18);
addHeart(0.91, 0.42, 0.995, 0.14);

// --------------------------------------------------
// LID
// The hinge sits along the back edge of the box.
// --------------------------------------------------

const lidPivot = new THREE.Group();
lidPivot.position.set(0, 0.82, -0.91);
lunch.add(lidPivot);

// Cream underside / body of lid
roundedBox(
  lidPivot,
  [2.82, 0.12, 1.98],
  [0, 0, 0.91],
  materials.cream,
  0.12
);

// Pink outer surface
roundedBox(
  lidPivot,
  [2.67, 0.045, 1.83],
  [0, 0.082, 0.91],
  materials.pink,
  0.12
);

// --------------------------------------------------
// LID LABEL
// --------------------------------------------------

function makeLabelTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 300;

  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#76564b';
  ctx.font = '500 62px Georgia, serif';
  ctx.fillText("Hauno's lunch", 512, 112);

  ctx.fillStyle = '#a77b70';
  ctx.font = 'italic 46px Georgia, serif';
  ctx.fillText('by Tate ♡', 512, 198);

  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(
    renderer.capabilities.getMaxAnisotropy(),
    4
  );

  return texture;
}

const label = new THREE.Mesh(
  new THREE.PlaneGeometry(1.95, 0.57),
  new THREE.MeshBasicMaterial({
    map: makeLabelTexture(),
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  })
);

label.rotation.x = -Math.PI / 2;
label.position.set(0, 0.108, 0.91);
lidPivot.add(label);

// Small hearts on the lid
const lidHeartMaterial = new THREE.MeshStandardMaterial({
  color: '#d58f8c',
  roughness: 0.55
});

sphere(
  lidPivot,
  [-0.98, 0.11, 0.42],
  [0.07, 0.025, 0.07],
  lidHeartMaterial
);

sphere(
  lidPivot,
  [0.98, 0.11, 1.40],
  [0.07, 0.025, 0.07],
  lidHeartMaterial
);

// --------------------------------------------------
// OPEN / CLOSE INTERACTION
// --------------------------------------------------

let isOpen = false;
let lidAngle = 0;
let targetAngle = 0;
let pointerStart = null;

function toggleLunch() {
  isOpen = !isOpen;
  targetAngle = isOpen ? -1.85 : 0;

  if (hint) {
    hint.style.opacity = isOpen ? '0' : '1';
  }

  if (replay) {
    replay.hidden = !isOpen;
  }

  if (message) {
    message.textContent = isOpen
      ? 'Surprise! I made this just for you ♡'
      : 'A little box full of love, made just for you.';
  }
}

canvas.addEventListener('pointerdown', (event) => {
  pointerStart = {
    x: event.clientX,
    y: event.clientY
  };
});

canvas.addEventListener('pointerup', (event) => {
  if (!pointerStart) return;

  const dx = event.clientX - pointerStart.x;
  const dy = event.clientY - pointerStart.y;
  pointerStart = null;

  if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
    toggleLunch();
  }
});

if (replay) {
  replay.addEventListener('click', () => {
    if (isOpen) toggleLunch();
  });
}

// --------------------------------------------------
// RESPONSIVE CAMERA
// --------------------------------------------------

function resize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (!width || !height) return;

  renderer.setSize(width, height, false);
  camera.aspect = width / height;

  camera.position.set(
    width < 430 ? 3.8 : 4.2,
    width < 430 ? 4.7 : 4.5,
    width < 430 ? 6.8 : 6.2
  );

  camera.lookAt(0, 0.65, 0);
  camera.updateProjectionMatrix();
}

const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(canvas);
resize();

if (loading) {
  loading.style.display = 'none';
}

// --------------------------------------------------
// ANIMATION
// --------------------------------------------------

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  // Gentle floating and swaying
  lunch.position.y = Math.sin(time * 1.5) * 0.035;
  lunch.rotation.y = Math.sin(time * 0.65) * 0.035;

  // Smooth lid opening and closing
  lidAngle += (targetAngle - lidAngle) * 0.09;
  lidPivot.rotation.x = lidAngle;

  renderer.render(scene, camera);
}

animate();
