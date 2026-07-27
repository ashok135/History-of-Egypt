import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Mummy3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 5.5;

    // WebGLRenderer with transparent background
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Dynamic procedural striped texture for the Nemes headdress
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Base Lapis Blue
      ctx.fillStyle = '#112244'; 
      ctx.fillRect(0, 0, 256, 256);
      // Gold stripes
      ctx.fillStyle = '#C5A880';
      const stripeWidth = 16;
      for (let i = 0; i < 256; i += stripeWidth * 2) {
        ctx.fillRect(i, 0, stripeWidth, 256);
      }
    }
    
    const stripesTexture = new THREE.CanvasTexture(canvas);
    stripesTexture.wrapS = THREE.RepeatWrapping;
    stripesTexture.wrapT = THREE.RepeatWrapping;
    stripesTexture.repeat.set(4, 1);

    // Materials
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xC5A880,
      metalness: 0.95,
      roughness: 0.15,
      bumpScale: 0.05
    });

    const stripesMat = new THREE.MeshStandardMaterial({
      map: stripesTexture,
      metalness: 0.9,
      roughness: 0.18
    });

    const blueBeardMat = new THREE.MeshStandardMaterial({
      color: 0x112244,
      metalness: 0.85,
      roughness: 0.2
    });

    const eyeGlowMat = new THREE.MeshBasicMaterial({
      color: 0xFAF9F6
    });

    // Mummy head/mask group
    const mummyGroup = new THREE.Group();

    // 1. Face/Skin (oval sphere shape)
    const faceGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const faceMesh = new THREE.Mesh(faceGeo, goldMat);
    faceMesh.scale.set(1, 1.35, 0.95);
    faceMesh.position.set(0, 0, 0);
    mummyGroup.add(faceMesh);

    // 2. Nemes Headdress (back cover)
    const backGeo = new THREE.SphereGeometry(1.05, 32, 32);
    const backMesh = new THREE.Mesh(backGeo, stripesMat);
    backMesh.position.set(0, 0.05, -0.22);
    backMesh.scale.set(1.15, 1.15, 0.7);
    mummyGroup.add(backMesh);

    // 3. Nemes side lappets (boxes hanging down left and right)
    const lappetGeo = new THREE.BoxGeometry(0.26, 1.1, 0.18);
    
    const leftLappet = new THREE.Mesh(lappetGeo, stripesMat);
    leftLappet.position.set(-0.62, -0.45, 0.15);
    leftLappet.rotation.z = 0.06;
    mummyGroup.add(leftLappet);

    const rightLappet = new THREE.Mesh(lappetGeo, stripesMat);
    rightLappet.position.set(0.62, -0.45, 0.15);
    rightLappet.rotation.z = -0.06;
    mummyGroup.add(rightLappet);

    // 4. Crown cap on top of Nemes
    const capGeo = new THREE.CylinderGeometry(0.65, 1.05, 0.6, 32);
    const capMesh = new THREE.Mesh(capGeo, stripesMat);
    capMesh.position.set(0, 0.72, -0.15);
    capMesh.rotation.x = -0.12;
    mummyGroup.add(capMesh);

    // 5. Chin Beard
    const beardGeo = new THREE.CylinderGeometry(0.08, 0.05, 0.5, 16);
    const beardMesh = new THREE.Mesh(beardGeo, blueBeardMat);
    beardMesh.position.set(0, -0.85, 0.35);
    beardMesh.rotation.x = 0.18;
    mummyGroup.add(beardMesh);

    // Beard gold bands
    const bandGeo = new THREE.TorusGeometry(0.075, 0.015, 8, 24);
    const band1 = new THREE.Mesh(bandGeo, goldMat);
    band1.position.set(0, -0.75, 0.33);
    band1.rotation.x = Math.PI / 2 + 0.18;
    mummyGroup.add(band1);

    const band2 = new THREE.Mesh(bandGeo, goldMat);
    band2.position.set(0, -0.95, 0.37);
    band2.rotation.x = Math.PI / 2 + 0.18;
    mummyGroup.add(band2);

    // 6. Glowing Eyes
    const eyeGeo = new THREE.SphereGeometry(0.06, 16, 16);
    
    const leftEye = new THREE.Mesh(eyeGeo, eyeGlowMat);
    leftEye.position.set(-0.25, 0.2, 0.74);
    mummyGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeGlowMat);
    rightEye.position.set(0.25, 0.2, 0.74);
    mummyGroup.add(rightEye);

    // 7. Forehead Cobra (Uraeus)
    const cobraGroup = new THREE.Group();
    const bodyGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.2, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, goldMat);
    bodyMesh.rotation.x = -0.3;
    cobraGroup.add(bodyMesh);

    const headGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const headMesh = new THREE.Mesh(headGeo, goldMat);
    headMesh.position.set(0, 0.1, 0.03);
    cobraGroup.add(headMesh);

    cobraGroup.position.set(0, 0.62, 0.74);
    mummyGroup.add(cobraGroup);

    // Add everything to scene
    scene.add(mummyGroup);

    // Adjust position of group to be centered
    mummyGroup.position.y = -0.1;

    // Lighting
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Gold Directional light tracking the mouse
    const dirLight = new THREE.DirectionalLight(0xfff3d1, 2.5);
    dirLight.position.set(2, 4, 5);
    scene.add(dirLight);

    // Backlight to create a gorgeous halo silhouette
    const backLight = new THREE.PointLight(0xC5A880, 2.0, 15);
    backLight.position.set(0, 0.5, -2);
    scene.add(backLight);

    // Subtle blue fill light from the bottom left
    const fillLight = new THREE.DirectionalLight(0x224488, 1.2);
    fillLight.position.set(-4, -2, 2);
    scene.add(fillLight);

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse positions (-1 to 1)
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Render loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Lerp head rotation to look at the mouse
      const targetRotY = mouseRef.current.x * 0.48;
      const targetRotX = -mouseRef.current.y * 0.38;

      mummyGroup.rotation.y += (targetRotY - mummyGroup.rotation.y) * 0.075;
      mummyGroup.rotation.x += (targetRotX - mummyGroup.rotation.x) * 0.075;

      // Update light position slightly based on mouse to move specular reflections
      dirLight.position.x = mouseRef.current.x * 3.5 + 2;
      dirLight.position.y = mouseRef.current.y * 3.5 + 4;

      // Slow floating animation
      mummyGroup.position.y = -0.1 + Math.sin(elapsedTime * 1.6) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      faceGeo.dispose();
      backGeo.dispose();
      lappetGeo.dispose();
      capGeo.dispose();
      beardGeo.dispose();
      bandGeo.dispose();
      eyeGeo.dispose();
      bodyGeo.dispose();
      headGeo.dispose();
      goldMat.dispose();
      stripesMat.dispose();
      blueBeardMat.dispose();
      eyeGlowMat.dispose();
      stripesTexture.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full cursor-none"
      style={{ minHeight: '380px', maxHeight: '680px' }}
    />
  );
}
