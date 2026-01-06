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

    // Base colors - VERY dark for black squares
    const baseColor = isDark ? '#020202' : '#f0f0e8';

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    // 1. Cloud/Sponge Layer
    ctx.globalAlpha = 1.0;

    if (isDark) {
        // SUBTLE effect on black - just hints of grey
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const r = 30 + Math.random() * 100;

            const g = ctx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, 'rgba(40,40,40,0.15)'); // Very subtle
            g.addColorStop(1, 'transparent');

            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 512, 512);
        }
    } else {
        // VISIBLE effect on white - clear marble patterns
        for (let i = 0; i < 60; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const r = 20 + Math.random() * 80;

            const g = ctx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, 'rgba(200,195,185,0.5)'); // Visible beige/grey patches
            g.addColorStop(0.5, 'rgba(220,215,205,0.3)');
            g.addColorStop(1, 'transparent');

            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 512, 512);
        }
    }

    // 2. Veins
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    if (isDark) {
        // Subtle grey veins on black
        const numVeins = 6;
        for (let i = 0; i < numVeins; i++) {
            ctx.strokeStyle = '#303030';
            ctx.globalAlpha = 0.4;
            ctx.lineWidth = 1 + Math.random() * 2;

            let x = Math.random() * 512;
            let y = Math.random() * 512;

            ctx.beginPath();
            ctx.moveTo(x, y);

            const segments = 3 + Math.random() * 3;
            for (let j = 0; j < segments; j++) {
                const dx = (Math.random() - 0.5) * 180;
                const dy = (Math.random() - 0.5) * 180;
                const cp1x = x + (Math.random() - 0.5) * 50;
                const cp1y = y + (Math.random() - 0.5) * 50;

                x += dx;
                y += dy;

                ctx.quadraticCurveTo(cp1x, cp1y, x, y);
            }
            ctx.stroke();
        }
    } else {
        // Visible grey veins on white
        const numVeins = 10;
        for (let i = 0; i < numVeins; i++) {
            ctx.strokeStyle = '#b0b0b0';
            ctx.globalAlpha = 0.6;
            ctx.lineWidth = 1.5 + Math.random() * 3;

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

        // Fine detail veins for white
        for (let i = 0; i < 15; i++) {
            ctx.strokeStyle = '#c8c8c8';
            ctx.globalAlpha = 0.5;
            ctx.lineWidth = 0.5 + Math.random() * 1;

            let x = Math.random() * 512;
            let y = Math.random() * 512;

            ctx.beginPath();
            ctx.moveTo(x, y);

            for (let j = 0; j < 3; j++) {
                x += (Math.random() - 0.5) * 80;
                y += (Math.random() - 0.5) * 80;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}
