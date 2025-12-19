import React, { useMemo, useState } from 'react';
import { useGame } from './GameStateProvider';
import Board from './Board';
import Piece from './Piece';

export default function GameScene() {
    const { game, fen, turn, makeMove, setPendingPromotion, gameStatus } = useGame();
    const [selectedSquare, setSelectedSquare] = useState(null);

    // Derive Pieces from current board state
    const pieces = useMemo(() => {
        const p = [];
        const board = game.board();
        // board[0] is rank 8, board[7] is rank 1
        // board[row][col] where col 0 = file a
        board.forEach((boardRow, r) => {
            boardRow.forEach((square, c) => {
                if (square) {
                    const file = String.fromCharCode(97 + c); // 0='a'
                    const rank = 8 - r; // board row 0 is rank 8, row 7 is rank 1
                    const squareName = `${file}${rank}`;

                    // Position: same as Board.jsx
                    // x = col - 3.5
                    // z = 3.5 - (rank - 1)
                    const x = c - 3.5;
                    const z = 3.5 - (rank - 1);

                    p.push({
                        type: square.type,
                        color: square.color,
                        position: [x, 0, z],
                        key: `${squareName}-${square.type}-${square.color}`,
                        squareName: squareName
                    });
                }
            });
        });
        return p;
    }, [fen, game]);

    // Derive Valid Moves for selection
    const validMoves = useMemo(() => {
        if (!selectedSquare) return [];
        try {
            return game.moves({ square: selectedSquare, verbose: true });
        } catch (e) { return []; }
    }, [selectedSquare, fen, game]);

    // Get last move for highlighting
    const lastMove = useMemo(() => {
        const history = game.history({ verbose: true });
        if (history.length > 0) return history[history.length - 1];
        return null;
    }, [fen, game]);

    const handleSquareClick = (clickedSquare) => {
        // Prevent interaction if game over
        if (gameStatus !== 'in_progress' && gameStatus !== 'check') return;

        // Check if this click completes a move from selectedSquare
        if (selectedSquare) {
            // Did we click the same square? Deselect
            if (selectedSquare === clickedSquare) {
                setSelectedSquare(null);
                return;
            }

            // Check against valid moves
            const move = validMoves.find(m => m.to === clickedSquare);
            if (move) {
                // Check promotion
                if (move.flags.includes('p') || move.promotion) {
                    setPendingPromotion({
                        from: selectedSquare,
                        to: clickedSquare,
                        color: turn
                    });
                } else {
                    makeMove({ from: selectedSquare, to: clickedSquare });
                }
                setSelectedSquare(null);
                return;
            }
        }

        // If not completing a move, try to select the piece
        const piece = game.get(clickedSquare);
        if (piece && piece.color === turn) {
            setSelectedSquare(clickedSquare);
        } else {
            // Clicked empty square or enemy piece (not as capture) -> Deselect
            setSelectedSquare(null);
        }
    };

    return (
        <group>
            <Board
                onSquareClick={handleSquareClick}
                selectedSquare={selectedSquare}
                validMoves={validMoves}
                lastMove={lastMove}
            />
            {pieces.map((p) => (
                <Piece
                    key={p.key}
                    type={p.type}
                    color={p.color}
                    position={p.position}
                    onClick={() => handleSquareClick(p.squareName)}
                />
            ))}
        </group>
    );
}
