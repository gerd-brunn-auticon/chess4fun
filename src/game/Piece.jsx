import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createWoodTexture } from './WoodTexture';

export default function Piece({ type, color, position, onClick, theme }) {
    const isWhite = color === 'w';
    const isClassic = theme === 'classic';

    // Generate wood texture for classic mode
    const woodTexture = useMemo(() => {
        if (isClassic) return createWoodTexture(!isWhite); // Invert logic: Dark wood for black
        return null;
    }, [isClassic, isWhite]);

    const materialProps = isClassic ? {
        color: isWhite ? '#e6c9a8' : '#6d4c41', // Base color
        map: woodTexture, // Procedural grain
        roughness: 0.6,
        metalness: 0.0,
        bumpMap: woodTexture, // Use grain for slight bump
        bumpScale: 0.02
    } : {
        color: isWhite ? '#eecfa1' : '#3d2b1f',
        roughness: 0.7,
        metalness: 0.0
    };

    return (
        <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
            {isClassic ? (
                <ClassicPiece type={type} materialProps={materialProps} />
            ) : (
                <MinimalPiece type={type} materialProps={materialProps} />
            )}
        </group>
    );
}

// --- Old "Minimal" Geometry ---
function MinimalPiece({ type, materialProps }) {
    switch (type) {
        case 'p': // Pawn
            return (
                <group position={[0, 0.3, 0]}>
                    <mesh castShadow receiveShadow position={[0, -0.1, 0]}>
                        <cylinderGeometry args={[0.2, 0.3, 0.4, 16]} />
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
                        <sphereGeometry args={[0.15, 16, 16]} />
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                </group>
            );
        case 'r': // Rook
            return (
                <group position={[0, 0.4, 0]}>
                    <mesh castShadow receiveShadow>
                        <cylinderGeometry args={[0.25, 0.3, 0.8, 4]} />
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                </group>
            );
        case 'n': // Knight
            return (
                <group position={[0, 0.4, 0]}>
                    <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
                        <cylinderGeometry args={[0.25, 0.3, 0.4, 16]} />
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
                        <boxGeometry args={[0.2, 0.4, 0.4]} />
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                </group>
            )
        case 'b': // Bishop
            return (
                <group position={[0, 0.45, 0]}>
                    <mesh castShadow receiveShadow>
                        <cylinderGeometry args={[0.1, 0.3, 0.9, 16]} />
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
                        <coneGeometry args={[0.15, 0.3, 16]} />
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                </group>
            )
        case 'q': // Queen
            return (
                <group position={[0, 0.55, 0]}>
                    <mesh castShadow receiveShadow>
                        <cylinderGeometry args={[0.2, 0.35, 1.1, 16]} />
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
                        <sphereGeometry args={[0.2, 16, 16]} />
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                </group>
            )
        case 'k': // King
            return (
                <group position={[0, 0.6, 0]}>
                    <mesh castShadow receiveShadow>
                        <cylinderGeometry args={[0.2, 0.35, 1.2, 16]} />
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
                        <boxGeometry args={[0.15, 0.15, 0.15]} />
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, 0.85, 0]}>
                        <boxGeometry args={[0.05, 0.15, 0.05]} />
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, 0.85, 0]}>
                        <boxGeometry args={[0.15, 0.05, 0.05]} />
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                </group>
            )
        default: return null;
    }
}

// --- New "Classic" Lathe Geometry ---
function ClassicPiece({ type, materialProps, color }) {
    const points = useMemo(() => getPieceProfile(type), [type]);
    const isWhite = color === 'w';

    // Construct Knight Shape (Horse Head) - Better Profile
    const knightShape = useMemo(() => {
        if (type !== 'n') return null;
        const s = new THREE.Shape();

        // Draw profile facing RIGHT (+X) for now, will rotate to face Z
        // Center X around 0 for balance

        // Base of Neck
        s.moveTo(-0.15, 0);
        s.lineTo(0.15, 0);

        // Front of Chest/Neck (Curving up and right)
        s.bezierCurveTo(0.25, 0.1, 0.25, 0.3, 0.2, 0.45); // Throat

        // Jaw/Snout
        s.lineTo(0.35, 0.35); // Chin
        s.lineTo(0.38, 0.38); // Nose bottom
        s.lineTo(0.38, 0.48); // Nose top
        s.lineTo(0.28, 0.60); // Bridge
        s.lineTo(0.25, 0.65); // Forehead

        // Ears
        s.lineTo(0.20, 0.75); // Ear Front
        s.lineTo(0.12, 0.70); // Ear Back

        // Mane/Back (Curving down and left)
        s.bezierCurveTo(0.05, 0.6, -0.1, 0.5, -0.2, 0.2); // Mane

        s.lineTo(-0.15, 0); // Close loop
        return s;
    }, [type]);

    if (type === 'n') {
        const extrudeSettings = {
            steps: 2,
            depth: 0.12,
            bevelEnabled: true,
            bevelThickness: 0.03, // Softer edges
            bevelSize: 0.02,
            bevelSegments: 4
        };

        // Rotation logic:
        // By default, shape is drawn in X/Y plane.
        // We extrude in Z.
        // We want the "Face" (Profile) to point towards enemy.
        // The profile points +X.
        // White starts at Z=7 (files). Needs to face -Z? No, Board Z mapping.
        // Using `rotation` to orient the flat profile to face forward.
        // A rotation of [0, Math.PI/2, 0] makes +X face +Z.

        // Correct Rotation:
        // White pieces (at bottom) should face UP (-Z usually? Board mapping).
        // Black pieces (at top) should face DOWN (+Z).

        // Let's assume standard board: White plays from Z=POSITIVE to Z=NEGATIVE.
        // So White Knights should face -Z.
        // Black Knights should face +Z.

        const yRotation = isWhite ? Math.PI / 2 : Math.PI * 1.5;

        return (
            <group position={[0, 0, 0]}>
                {/* Standard Round Base */}
                <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
                    <cylinderGeometry args={[0.3, 0.35, 0.2, 32]} />
                    <meshStandardMaterial {...materialProps} />
                </mesh>

                {/* Extruded Horse Head */}
                {/* Center the extrusion thickness (Z) and adjust Y height */}
                <group
                    position={[0, 0.25, 0]}
                    rotation={[0, yRotation, 0]}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        position={[0, 0, -0.06]} // Center the extrusion depth (0.12 / 2)
                    >
                        <extrudeGeometry args={[knightShape, extrudeSettings]} />
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                </group>
            </group>
        );
    }

    return (
        <group position={[0, 0, 0]}>
            <mesh castShadow receiveShadow>
                <latheGeometry args={[points, 48]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Special tops for King */}
            {type === 'k' && (
                <group position={[0, 0.95, 0]}>
                    <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
                        <boxGeometry args={[0.08, 0.3, 0.08]} /> {/* Cross V */}
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
                        <boxGeometry args={[0.22, 0.08, 0.08]} /> {/* Cross H */}
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                </group>
            )}
        </group>
    );
}

function getPieceProfile(type) {
    const points = [];
    // Helper to add point
    const p = (x, y) => points.push(new THREE.Vector2(x, y));

    switch (type) {
        case 'p': // Pawn
            p(0, 0); p(0.26, 0); p(0.26, 0.05); p(0.2, 0.1); // Base
            p(0.12, 0.2); p(0.08, 0.4); // Stem
            p(0.15, 0.45); p(0.15, 0.55); // Collar
            p(0.18, 0.6); p(0.12, 0.75); p(0, 0.8); // Head
            break;
        case 'r': // Rook - Distinctive
            p(0, 0); p(0.32, 0); p(0.32, 0.1); p(0.28, 0.15); // Wide Base
            p(0.25, 0.2); p(0.22, 0.5); // Body
            p(0.3, 0.6); p(0.3, 0.8); // Head Base
            p(0.32, 0.9); p(0.2, 0.9); p(0.2, 0.8); p(0, 0.8); // Top battlements
            break;
        case 'b': // Bishop - Distinctive
            p(0, 0); p(0.3, 0); p(0.3, 0.08); p(0.22, 0.15); // Base
            p(0.14, 0.3); p(0.12, 0.55); // Tall Body
            p(0.2, 0.6); p(0.22, 0.65); // Collar
            p(0.18, 0.85); p(0.05, 0.92); p(0, 0.95); // Hat
            break;
        case 'q': // Queen
            p(0, 0); p(0.34, 0); p(0.34, 0.05); p(0.25, 0.15); // Base
            p(0.16, 0.3); p(0.14, 0.6); // Body
            p(0.22, 0.7); p(0.28, 0.85); // Crown Base
            p(0.32, 0.95); p(0, 0.95); // Crown Top
            break;
        case 'k': // King
            p(0, 0); p(0.35, 0); p(0.35, 0.05); p(0.28, 0.15); // Base
            p(0.2, 0.3); p(0.18, 0.6); // Body
            p(0.28, 0.7); p(0.28, 0.85); // Crown Base
            p(0.1, 0.95); p(0, 0.95); // Top Platform
            break;
        default: break;
    }
    return points;
}
