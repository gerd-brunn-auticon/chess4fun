import * as THREE from 'three';

export function createWoodTexture(isDark) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base color
    const baseColor = isDark ? '#4a332a' : '#e6c9a8';
    const grainColor = isDark ? '#2e1e18' : '#dcb285';

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    // Draw wood grain
    ctx.fillStyle = grainColor;
    ctx.globalAlpha = 0.4;

    for (let i = 0; i < 40; i++) {
        const x = Math.random() * 512;
        const thickness = 2 + Math.random() * 8;
        const waviness = 10 + Math.random() * 20;

        ctx.beginPath();
        for (let y = 0; y <= 512; y += 10) {
            const offsetX = Math.sin(y / waviness) * 10;
            ctx.lineTo(x + offsetX, y);
        }
        ctx.strokeStyle = grainColor;
        ctx.lineWidth = thickness;
        ctx.stroke();
    }

    // Add noise
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillStyle = Math.random() > 0.5 ? '#000' : '#fff';
        ctx.globalAlpha = 0.05;
        ctx.fillRect(x, y, 1, 10 + Math.random() * 20);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}
