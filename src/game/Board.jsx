import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { createWoodTexture, createMarbleTexture } from './WoodTexture';

export default function Board({ onSquareClick, selectedSquare, validMoves, lastMove, theme }) {
    const squares = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const isClassic = theme === 'classic';

    // Generate marble textures for classic mode only (Board)
    const lightMarble = useMemo(() => isClassic ? createMarbleTexture(false) : null, [isClassic]);
    const darkMarble = useMemo(() => isClassic ? createMarbleTexture(true) : null, [isClassic]);

    // Create 64 squares
    // Board coordinate system: 
    // - col 0-7 = files a-h
    // - row 0-7 = ranks 1-8
    // Position mapping:
    // - a1 (col=0, rank=1) -> x = -3.5, z = 3.5
    // - h8 (col=7, rank=8) -> x = 3.5, z = -3.5
    for (let rank = 1; rank <= 8; rank++) {
        for (let col = 0; col < 8; col++) {
            const file = files[col];
            const squareName = `${file}${rank}`;

            // Position calculation
            const x = col - 3.5;
            const z = 3.5 - (rank - 1); // rank 1 -> z=3.5, rank 8 -> z=-3.5

            // Standard chess: a1 is dark (black) square
            // a1: col=0, rank=1 -> (0+1)%2 = 1 -> should be dark
            const isDark = (col + rank) % 2 === 1;

            // Check highlights
            const isSelected = selectedSquare === squareName;
            const isValidMove = validMoves.find(m => m.to === squareName);
            const isLastMove = lastMove && (lastMove.from === squareName || lastMove.to === squareName);

            squares.push(
                <Square
                    key={squareName}
                    position={[x, 0, z]}
                    isDark={isDark}
                    squareName={squareName}
                    isSelected={isSelected}
                    isValidMove={isValidMove}
                    isLastMove={isLastMove}
                    onClick={() => onSquareClick(squareName)}
                    theme={theme}
                    texture={isDark ? darkMarble : lightMarble}
                />
            );
        }
    }

    return (
        <group>
            {squares}
            <BoardLabels files={files} />
            <Border theme={theme} texture={darkMarble} />
        </group>
    );
}

function Square({ position, isDark, isSelected, isValidMove, isLastMove, onClick, theme, texture }) {
    const isClassic = theme === 'classic';

    // Colors
    // Minimal: Standard Brown/Beige 
    // Classic: Use white to let texture show through (texture provides the color)
    const darkColor = isClassic ? '#ffffff' : '#5c4033';
    const lightColor = isClassic ? '#ffffff' : '#deb887';

    // Highlight colors
    const darkSelected = '#b8860b';
    const lightSelected = '#ffd700';
    const darkLastMove = '#6b8e23';
    const lightLastMove = '#9acd32';

    let color;
    if (isSelected) {
        color = isDark ? darkSelected : lightSelected;
    } else if (isLastMove) {
        color = isDark ? darkLastMove : lightLastMove;
    } else {
        color = isDark ? darkColor : lightColor;
    }

    return (
        <group position={position}>
            <mesh
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                receiveShadow
                position={[0, -0.1, 0]}
            >
                <boxGeometry args={[0.98, 0.2, 0.98]} />
                {isClassic ? (
                    <meshPhysicalMaterial
                        color={color}
                        map={texture}
                        roughness={0.8}
                        metalness={0.1}
                        clearcoat={0.0}
                        clearcoatRoughness={1.0}
                        bumpMap={texture}
                        bumpScale={0.005} // Subtle texture
                    />
                ) : (
                    <meshStandardMaterial color={color} roughness={0.7} />
                )}
            </mesh>

            {/* Valid Move Indicator - Ring for captures, dot for normal moves */}
            {isValidMove && (
                <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    {(isValidMove.flags.includes('c') || isValidMove.flags.includes('e')) ? (
                        <>
                            <ringGeometry args={[0.3, 0.4, 32]} />
                            <meshBasicMaterial color="#e53935" transparent opacity={0.7} />
                        </>
                    ) : (
                        <>
                            <circleGeometry args={[0.15, 32]} />
                            <meshBasicMaterial color="#43a047" transparent opacity={0.7} />
                        </>
                    )}
                </mesh>
            )}
        </group>
    );
}

function BoardLabels({ files }) {
    const labels = [];
    const labelColor = '#cccccc';
    const fontSize = 0.3;

    // File labels (a-h) on both sides
    for (let i = 0; i < 8; i++) {
        const x = i - 3.5;
        // Bottom side (near rank 1)
        labels.push(
            <Text
                key={`file-bottom-${i}`}
                position={[x, 0.01, 4.3]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={fontSize}
                color={labelColor}
                anchorX="center"
                anchorY="middle"
            >
                {files[i].toUpperCase()}
            </Text>
        );
        // Top side (near rank 8)
        labels.push(
            <Text
                key={`file-top-${i}`}
                position={[x, 0.01, -4.3]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={fontSize}
                color={labelColor}
                anchorX="center"
                anchorY="middle"
            >
                {files[i].toUpperCase()}
            </Text>
        );
    }

    // Rank labels (1-8) on both sides
    for (let rank = 1; rank <= 8; rank++) {
        const z = 3.5 - (rank - 1);
        // Left side
        labels.push(
            <Text
                key={`rank-left-${rank}`}
                position={[-4.3, 0.01, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={fontSize}
                color={labelColor}
                anchorX="center"
                anchorY="middle"
            >
                {rank}
            </Text>
        );
        // Right side
        labels.push(
            <Text
                key={`rank-right-${rank}`}
                position={[4.3, 0.01, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={fontSize}
                color={labelColor}
                anchorX="center"
                anchorY="middle"
            >
                {rank}
            </Text>
        );
    }

    return <>{labels}</>;
}

function Border({ theme, texture }) {
    const isClassic = theme === 'classic';
    return (
        <mesh position={[0, -0.25, 0]} receiveShadow>
            <boxGeometry args={[9.5, 0.3, 9.5]} />
            {isClassic ? (
                <meshPhysicalMaterial
                    color="#000000"
                    map={texture}
                    roughness={0.6}
                    metalness={0.1}
                    clearcoat={0.0}
                />
            ) : (
                <meshStandardMaterial color="#2d2d2d" roughness={0.9} />
            )}
        </mesh>
    );
}
