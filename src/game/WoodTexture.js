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

    // Base colors - the texture itself provides the board square color
    const baseColor = isDark ? '#1a1a1a' : '#f0f0e8';

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    // 1. Cloud/Sponge Layer - Creates depth variation
    ctx.globalAlpha = 1.0;
    for (let i = 0; i < 80; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 20 + Math.random() * 80;

        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        if (isDark) {
            // Lighter patches on dark marble
            g.addColorStop(0, 'rgba(100,100,100,0.3)');
            g.addColorStop(0.5, 'rgba(60,60,60,0.2)');
            g.addColorStop(1, 'transparent');
        } else {
            // Darker patches on light marble
            g.addColorStop(0, 'rgba(180,175,165,0.4)');
            g.addColorStop(0.5, 'rgba(200,195,185,0.3)');
            g.addColorStop(1, 'transparent');
        }

        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 512, 512);
    }

    // 2. Strong Veins - Very visible
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const numVeins = 12;
    for (let i = 0; i < numVeins; i++) {
        if (isDark) {
            ctx.strokeStyle = '#808080'; // Grey veins on black
        } else {
            ctx.strokeStyle = '#a0a0a0'; // Grey veins on white
        }
        ctx.globalAlpha = isDark ? 0.7 : 0.5;
        ctx.lineWidth = 1.5 + Math.random() * 4;

        let x = Math.random() * 512;
        let y = Math.random() * 512;

        ctx.beginPath();
        ctx.moveTo(x, y);

        const segments = 3 + Math.random() * 4;
        for (let j = 0; j < segments; j++) {
            const dx = (Math.random() - 0.5) * 200;
            const dy = (Math.random() - 0.5) * 200;
            const cp1x = x + (Math.random() - 0.5) * 60;
            const cp1y = y + (Math.random() - 0.5) * 60;

            x += dx;
            y += dy;

            ctx.quadraticCurveTo(cp1x, cp1y, x, y);
        }
        ctx.stroke();
    }

    // 3. Fine detail veins
    for (let i = 0; i < 20; i++) {
        ctx.strokeStyle = isDark ? '#505050' : '#c0c0c0';
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = 0.5 + Math.random() * 1.5;

        let x = Math.random() * 512;
        let y = Math.random() * 512;

        ctx.beginPath();
        ctx.moveTo(x, y);

        for (let j = 0; j < 3; j++) {
            x += (Math.random() - 0.5) * 100;
            y += (Math.random() - 0.5) * 100;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}
