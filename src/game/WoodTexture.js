import * as THREE from 'three';

export function createWoodTexture(isDark) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const baseColor = isDark ? '#4a332a' : '#e6c9a8';
    const grainColor = isDark ? '#2e1e18' : '#dcb285';

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

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

    // Deep black base for dark, cream for light
    const baseColor = isDark ? '#000000' : '#f5f5f0';

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    // 1. Cloud/Sponge Layer - VERY visible on black
    ctx.globalAlpha = 1.0;
    for (let i = 0; i < 60; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 30 + Math.random() * 100;

        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        if (isDark) {
            g.addColorStop(0, 'rgba(80,80,80,0.25)'); // Much more visible grey
            g.addColorStop(1, 'transparent');
        } else {
            g.addColorStop(0, 'rgba(0,0,0,0.05)');
            g.addColorStop(1, 'transparent');
        }

        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 512, 512);
    }

    // 2. Sharp Veins - HIGH CONTRAST
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const numVeins = 10;
    for (let i = 0; i < numVeins; i++) {
        // White veins on black, dark on light
        ctx.strokeStyle = isDark ? '#aaaaaa' : '#404040';
        ctx.globalAlpha = isDark ? 0.8 : 0.4;
        ctx.lineWidth = 1 + Math.random() * 3;

        let x = Math.random() * 512;
        let y = Math.random() * 512;

        ctx.beginPath();
        ctx.moveTo(x, y);

        const segments = 4 + Math.random() * 4;
        for (let j = 0; j < segments; j++) {
            const dx = (Math.random() - 0.5) * 250;
            const dy = (Math.random() - 0.5) * 250;
            const cp1x = x + (Math.random() - 0.5) * 80;
            const cp1y = y + (Math.random() - 0.5) * 80;

            x += dx;
            y += dy;

            ctx.quadraticCurveTo(cp1x, cp1y, x, y);
        }
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}
