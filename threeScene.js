/**
 * threeScene.js
 * Configura e renderiza o background interativo em 3D.
 */

let scene, camera, renderer, particles;
let targetX = 0, targetY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

initThree();
animateThree();

function initThree() {
    const canvas = document.getElementById('webgl-bg');
    if (!canvas) return;

    // 1. Configuração Básica do Canvas
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d0d0d, 0.0015);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 250;

    // 2. Geometria das Partículas
    const particleCount = 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Distribuição das partículas pelo espaço tridimensional
        positions[i] = (Math.random() - 0.5) * 600;     // X
        positions[i + 1] = (Math.random() - 0.5) * 600; // Y
        positions[i + 2] = (Math.random() - 0.5) * 600; // Z
        
        speeds.push({
            x: (Math.random() - 0.5) * 0.1,
            y: Math.random() * 0.15 + 0.05, // Fluxo sutil ascendente
            z: (Math.random() - 0.5) * 0.1
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.userData = { speeds: speeds };

    // 3. Textura e Material (Efeito de partícula Dourada desfocada)
    const pMaterial = new THREE.PointsMaterial({
        color: 0xd4af37, // Dourado Metálico
        size: 1.8,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    // 4. Junção do Sistema de Partículas
    particles = new THREE.Points(geometry, pMaterial);
    scene.add(particles);

    // 5. Adicionando Luz de Ambiente Sutil para Profundidade
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.08);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xe63946, 1.2, 500); // Brilho de ponto vermelho
    pointLight.position.set(0, 0, 100);
    scene.add(pointLight);

    // 6. Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Ouvintes de Eventos
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('deviceorientation', handleOrientation);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    targetX = (event.clientX - windowHalfX) * 0.04;
    targetY = (event.clientY - windowHalfY) * 0.04;
}

// Suporte para efeito de rotação via Giroscópio do Celular (Efeito Parallax real)
function handleOrientation(event) {
    if (event.gamma && event.beta) {
        targetX = event.gamma * 0.6; // Inclinação horizontal
        targetY = (event.beta - 45) * 0.6; // Inclinação vertical calibrada
    }
}

function animateThree() {
    requestAnimationFrame(animateThree);

    // Suavização do movimento da câmera (Interpolação Linear)
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Animação das partículas
    const positions = particles.geometry.attributes.position.array;
    const speeds = particles.geometry.userData.speeds;
    const count = positions.length;

    for (let i = 0; i < count; i += 3) {
        const index = i / 3;
        // Aplica velocidade de subida
        positions[i + 1] += speeds[index].y;
        positions[i] += speeds[index].x;

        // Reseta posição se subir demais
        if (positions[i + 1] > 300) {
            positions[i + 1] = -300;
            positions[i] = (Math.random() - 0.5) * 600;
        }
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y += 0.0005; // Rotação ambiente contínua do cosmos

    renderer.render(scene, camera);
}