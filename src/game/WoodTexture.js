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

export function createMarbleTexture(isDark) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Marble Colors (Deep Black / Off-White)
    const baseColor = isDark ? '#000000' : '#f5f5f0';
    const veinColor = isDark ? '#ffffff' : '#404040';

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    // 1. Soft Cloud/Sponge Layer
    for (let i = 0; i < 40; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 50 + Math.random() * 150;

        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)');
        g.addColorStop(1, 'transparent');

        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }

    // 2. Sharp Veins (High Contrast)
    ctx.strokeStyle = veinColor;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const numVeins = 8;
    for (let i = 0; i < numVeins; i++) {
        // High visibility for dark marble
        ctx.globalAlpha = isDark ? 0.6 : (0.2 + Math.random() * 0.3);
        ctx.lineWidth = 2 + Math.random() * 4;

        let x = Math.random() * 512;
        let y = Math.random() * 512;

        ctx.beginPath();
        ctx.moveTo(x, y);

        const segments = 5 + Math.random() * 5;
        for (let j = 0; j < segments; j++) {
            const dx = (Math.random() - 0.5) * 300;
            const dy = (Math.random() - 0.5) * 300;
            const cp1x = x + (Math.random() - 0.5) * 100;
            const cp1y = y + (Math.random() - 0.5) * 100;

            x += dx;
            y += dy;

            ctx.quadraticCurveTo(cp1x, cp1y, x, y);
        }
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}
