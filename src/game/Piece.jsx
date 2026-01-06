import React from 'react';

export default function Piece({ type, color, position, onClick }) {
    const isWhite = color === 'w';
    const materialProps = {
        color: isWhite ? '#f0d9b5' : '#3f2e22', // Maple vs Dark Walnut
        roughness: 0.2,   // Wood texture roughness
        metalness: 0.1,
        clearcoat: 1.0,   // High gloss lacquer
        clearcoatRoughness: 0.1, // Very smooth polish
        reflectivity: 1.0,
    };

    return (
        <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
            <PieceGeometry type={type} materialProps={materialProps} />
        </group>
    );
}

function PieceGeometry({ type, materialProps }) {
    switch (type) {
        case 'p': // Pawn
            return (
                <group position={[0, 0.3, 0]}>
                    <mesh castShadow receiveShadow position={[0, -0.1, 0]}>
                        <cylinderGeometry args={[0.2, 0.3, 0.4, 16]} />
                        <meshPhysicalMaterial {...materialProps} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
                        <sphereGeometry args={[0.15, 16, 16]} />
                        <meshPhysicalMaterial {...materialProps} />
                    </mesh>
                </group>
            );
        case 'r': // Rook
            return (
                <group position={[0, 0.4, 0]}>
                    <mesh castShadow receiveShadow>
                        <cylinderGeometry args={[0.25, 0.3, 0.8, 4]} />{/* Blocky base */}
                        <meshPhysicalMaterial {...materialProps} />
                    </mesh>
                </group>
            );
        case 'n': // Knight
            return (
                <group position={[0, 0.4, 0]}>
                    <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
                        <cylinderGeometry args={[0.25, 0.3, 0.4, 16]} />
                        <meshPhysicalMaterial {...materialProps} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
                        <boxGeometry args={[0.2, 0.4, 0.4]} />
                        <meshPhysicalMaterial {...materialProps} />
                    </mesh> {/* Abstract Horse Head */}
                </group>
            )
        case 'b': // Bishop
            return (
                <group position={[0, 0.45, 0]}>
                    <mesh castShadow receiveShadow>
                        <cylinderGeometry args={[0.1, 0.3, 0.9, 16]} />
                        <meshPhysicalMaterial {...materialProps} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
                        <coneGeometry args={[0.15, 0.3, 16]} />
                        <meshPhysicalMaterial {...materialProps} />
                    </mesh>
                </group>
            )
        case 'q': // Queen
            return (
                <group position={[0, 0.55, 0]}>
                    <mesh castShadow receiveShadow>
                        <cylinderGeometry args={[0.2, 0.35, 1.1, 16]} />
                        <meshPhysicalMaterial {...materialProps} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
                        <sphereGeometry args={[0.2, 16, 16]} />
                        <meshPhysicalMaterial {...materialProps} />
                    </mesh>
                </group>
            )
        case 'k': // King
            return (
                <group position={[0, 0.6, 0]}>
                    <mesh castShadow receiveShadow>
                        <cylinderGeometry args={[0.2, 0.35, 1.2, 16]} />
                        <meshPhysicalMaterial {...materialProps} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
                        <boxGeometry args={[0.15, 0.15, 0.15]} />
                        <meshPhysicalMaterial {...materialProps} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, 0.85, 0]}>
                        <boxGeometry args={[0.05, 0.15, 0.05]} /> {/* Cross V */}
                        <meshPhysicalMaterial {...materialProps} />
                    </mesh>
                    <mesh castShadow receiveShadow position={[0, 0.85, 0]}>
                        <boxGeometry args={[0.15, 0.05, 0.05]} /> {/* Cross H */}
                        <meshPhysicalMaterial {...materialProps} />
                    </mesh>
                </group>
            )
        default: return null;
    }
}
