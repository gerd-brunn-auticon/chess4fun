import React, { useMemo } from 'react';
import * as THREE from 'three';

export default function Piece({ type, color, position, onClick, theme }) {
    const isWhite = color === 'w';
    const isClassic = theme === 'classic';

    const materialProps = isClassic ? {
        color: isWhite ? '#e6c9a8' : '#4a332a', // Matte wood colors
        roughness: 0.65, // Natural matte wood
        metalness: 0.0,
        clearcoat: 0.0,  // No plastic reflection
    } : {
        color: isWhite ? '#eecfa1' : '#3d2b1f', // Original matte colors
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
function ClassicPiece({ type, materialProps }) {
    const points = useMemo(() => getPieceProfile(type), [type]);

    // Construct Knight Shape (Horse Head)
    const knightShape = useMemo(() => {
        if (type !== 'n') return null;
        const s = new THREE.Shape();
        s.moveTo(0, 0);       // Neck base center
        s.lineTo(0.15, 0);    // Neck base front
        s.quadraticCurveTo(0.25, 0.2, 0.28, 0.4); // Chest/Neck curve
        s.lineTo(0.3, 0.45);  // Jaw start
        s.lineTo(0.32, 0.35); // Chin
        s.lineTo(0.35, 0.38); // Snout tip bottom
        s.lineTo(0.35, 0.45); // Snout tip top
        s.lineTo(0.25, 0.6);  // Forehead
        s.lineTo(0.2, 0.7);   // Ears front
        s.lineTo(0.15, 0.65); // Ears top
        s.lineTo(0.1, 0.75);  // Mane top
        s.quadraticCurveTo(-0.1, 0.4, -0.15, 0); // Mane back curve
        s.lineTo(0, 0); // Close
        return s;
    }, [type]);

    if (type === 'n') {
        const extrudeSettings = {
            steps: 2,
            depth: 0.15, // Thickness of the horse
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelSegments: 3
        };

        return (
            <group position={[0, 0, 0]}>
                {/* Standard Round Base */}
                <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
                    <cylinderGeometry args={[0.28, 0.32, 0.2, 32]} />
                    <meshStandardMaterial {...materialProps} />
                </mesh>
                <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
                    <cylinderGeometry args={[0.22, 0.25, 0.1, 32]} />
                    <meshStandardMaterial {...materialProps} />
                </mesh>

                {/* Extruded Horse Head */}
                <mesh castShadow receiveShadow position={[0, 0.3, -0.075]} rotation={[0, 0, 0]}>
                    <extrudeGeometry args={[knightShape, extrudeSettings]} />
                    <meshStandardMaterial {...materialProps} />
                </mesh>
            </group>
        );
    }

    return (
        <group position={[0, 0, 0]}>
            <mesh castShadow receiveShadow>
                <latheGeometry args={[points, 32]} /> {/* Higher resolution lathe */}
                <meshStandardMaterial {...materialProps} />
            </mesh>
            {/* Special tops for King/Queen/Bishop */}
            {type === 'k' && (
                <group position={[0, 0.95, 0]}>
                    <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
                        <boxGeometry args={[0.04, 0.15, 0.04]} />
                        <meshStandardMaterial {...materialProps} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
                        <boxGeometry args={[0.12, 0.04, 0.04]} />
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
        case 'r': // Rook
            p(0, 0); p(0.3, 0); p(0.3, 0.1); p(0.25, 0.15); // Base
            p(0.22, 0.2); p(0.22, 0.5); // Body
            p(0.28, 0.6); p(0.28, 0.7); p(0.2, 0.75); p(0.25, 0.9); p(0, 0.9); // Top
            break;
        case 'b': // Bishop
            p(0, 0); p(0.28, 0); p(0.28, 0.05); p(0.22, 0.15); // Base
            p(0.15, 0.3); p(0.12, 0.5); // Body
            p(0.18, 0.6); p(0.15, 0.85); p(0, 0.9); // Top
            break;
        case 'q': // Queen
            p(0, 0); p(0.32, 0); p(0.32, 0.05); p(0.25, 0.15); // Base
            p(0.16, 0.3); p(0.14, 0.6); // Body
            p(0.22, 0.7); p(0.25, 0.85); // Crown Base
            p(0.3, 0.95); p(0, 0.95); // Crown Top
            break;
        case 'k': // King
            p(0, 0); p(0.32, 0); p(0.32, 0.05); p(0.25, 0.15); // Base
            p(0.18, 0.3); p(0.16, 0.6); // Body
            p(0.25, 0.7); p(0.25, 0.85); // Crown Base
            p(0.1, 0.9); p(0, 0.9); // Top Platform
            break;
        default: break;
    }
    return points;
}
