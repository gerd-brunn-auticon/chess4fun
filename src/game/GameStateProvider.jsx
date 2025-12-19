import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';

const GameContext = createContext();

export function useGame() {
    return useContext(GameContext);
}

export default function GameStateProvider({ children }) {
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState(game.fen());
    const [history, setHistory] = useState([]);
    const [turn, setTurn] = useState('w'); // 'w' or 'b'
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameStatus, setGameStatus] = useState('in_progress'); // 'check', 'checkmate', 'draw', etc.

    // Ref to always have access to latest game instance
    const gameRef = useRef(game);
    useEffect(() => {
        gameRef.current = game;
    }, [game]);

    // Audio refs (placeholder for now)
    const soundEnabled = useRef(true);

    // Game phase and player settings - must be declared before useEffect that references them
    const [pendingPromotion, setPendingPromotion] = useState(null);
    const [gamePhase, setGamePhase] = useState('start');
    const [playerColor, setPlayerColor] = useState('w');
    const [isBoardRotated, setIsBoardRotated] = useState(false);

    // Stockfish worker ref
    const stockfish = useRef(null);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [aiMoveDescription, setAiMoveDescription] = useState('');
    const [stockfishReady, setStockfishReady] = useState(false);

    // Game timer
    const [gameStartTime, setGameStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Timer effect - stop when game is over
    useEffect(() => {
        let interval = null;
        const gameEnded = isGameOver || gameStatus === 'checkmate' || gameStatus === 'stalemate' || gameStatus === 'draw';

        if (gamePhase === 'playing' && gameStartTime && !gameEnded) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - gameStartTime) / 1000));
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gamePhase, gameStartTime, isGameOver, gameStatus]);

    useEffect(() => {
        // Attempt to load stockfish - use the lite single-threaded version
        try {
            const worker = new Worker('/src/stockfish-17.1-lite-single-03e3232.js');

            worker.onmessage = (e) => {
                const msg = e.data;
                console.log('Stockfish:', msg);

                if (msg === 'readyok') {
                    setStockfishReady(true);
                    console.log('Stockfish ready!');
                }

                if (typeof msg === 'string' && msg.startsWith('bestmove')) {
                    const parts = msg.split(' ');
                    const move = parts[1];
                    if (move && move !== '(none)') {
                        // Convert uci (e2e4) to move object
                        const from = move.substring(0, 2);
                        const to = move.substring(2, 4);
                        const promotion = move.length > 4 ? move.substring(4, 5) : undefined;

                        // Use setTimeout and gameRef to avoid stale closure issues
                        setTimeout(() => {
                            const currentGame = gameRef.current;
                            try {
                                const result = currentGame.move({ from, to, promotion });
                                if (result) {
                                    // Update all state
                                    setFen(currentGame.fen());
                                    setTurn(currentGame.turn());
                                    setHistory(currentGame.history());

                                    // Check game status
                                    if (currentGame.isGameOver()) {
                                        setIsGameOver(true);
                                        if (currentGame.isCheckmate()) setGameStatus('checkmate');
                                        else if (currentGame.isDraw()) setGameStatus('draw');
                                        else if (currentGame.isStalemate()) setGameStatus('stalemate');
                                    } else if (currentGame.isCheck()) {
                                        setGameStatus('check');
                                    } else {
                                        setGameStatus('in_progress');
                                    }

                                    setAiMoveDescription(`AI: ${from} → ${to}`);
                                    console.log('Stockfish move applied:', from, to);
                                }
                            } catch (err) {
                                console.error('Error applying Stockfish move:', err);
                            }
                            setIsAiThinking(false);
                        }, 100);
                    } else {
                        setIsAiThinking(false);
                    }
                }
            };

            worker.onerror = (e) => {
                console.error("Stockfish worker error:", e);
                stockfish.current = null; // Mark as failed
                setIsAiThinking(false);
            };

            stockfish.current = worker;

            // Init UCI
            worker.postMessage('uci');
            worker.postMessage('setoption name Skill Level value 10');
            worker.postMessage('isready');

        } catch (e) {
            console.warn("Stockfish functionality unavailable", e);
            stockfish.current = null;
        }

        return () => {
            if (stockfish.current) stockfish.current.terminate();
        };
    }, []);

    // AI Turn Logic
    useEffect(() => {
        if (gamePhase === 'playing' && !isGameOver && turn !== playerColor) {
            // AI Turn
            setIsAiThinking(true);

            if (stockfish.current) {
                // Use Stockfish
                setTimeout(() => {
                    if (stockfish.current) {
                        stockfish.current.postMessage('position fen ' + game.fen());
                        stockfish.current.postMessage('go movetime 1000'); // 1s thinking
                    }
                }, 500);
            } else {
                // Fallback to random moves (use game.move directly)
                console.log("Using fallback random AI");
                setTimeout(() => {
                    const moves = game.moves({ verbose: true });
                    if (moves.length > 0) {
                        const randomMove = moves[Math.floor(Math.random() * moves.length)];
                        try {
                            const result = game.move({
                                from: randomMove.from,
                                to: randomMove.to,
                                promotion: randomMove.promotion
                            });
                            if (result) {
                                setFen(game.fen());
                                setTurn(game.turn());
                                setHistory(game.history());

                                // Check game status
                                if (game.isGameOver()) {
                                    setIsGameOver(true);
                                    if (game.isCheckmate()) setGameStatus('checkmate');
                                    else if (game.isDraw()) setGameStatus('draw');
                                    else if (game.isStalemate()) setGameStatus('stalemate');
                                } else if (game.isCheck()) {
                                    setGameStatus('check');
                                } else {
                                    setGameStatus('in_progress');
                                }

                                setAiMoveDescription(`AI: ${randomMove.from} → ${randomMove.to}`);
                            }
                        } catch (e) {
                            console.error('AI move error:', e);
                        }
                    }
                    setIsAiThinking(false);
                }, 800);
            }
        }
    }, [turn, gamePhase, isGameOver, playerColor, game]);

    const updateGameState = useCallback(() => {
        setFen(game.fen());
        setTurn(game.turn());
        setHistory(game.history());

        if (game.isGameOver()) {
            setIsGameOver(true);
            if (game.isCheckmate()) setGameStatus('checkmate');
            else if (game.isDraw()) setGameStatus('draw');
            else if (game.isStalemate()) setGameStatus('stalemate');
            else setGameStatus('game_over');
        } else if (game.isCheck()) {
            setGameStatus('check');
        } else {
            setGameStatus('in_progress');
        }
    }, [game]);

    const resetGame = useCallback(() => {
        const newGame = new Chess();
        setGame(newGame);
        setFen(newGame.fen());
        setTurn('w');
        setHistory([]);
        setIsGameOver(false);
        setGameStatus('in_progress');
    }, []);

    const startGame = (color) => {
        setPlayerColor(color);
        setIsBoardRotated(color === 'b');
        setGamePhase('playing');
        setGameStartTime(Date.now());
        setElapsedTime(0);
        resetGame();
    };

    const playSound = useCallback((type) => {
        if (!soundEnabled.current) return;

        console.log('Playing sound:', type);

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) {
                console.warn('AudioContext not supported');
                return;
            }

            const ctx = new AudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            const now = ctx.currentTime;

            if (type === 'capture') {
                oscillator.frequency.setValueAtTime(220, now);
                oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.1);
                oscillator.type = 'triangle';
                gainNode.gain.setValueAtTime(0.3, now);
            } else if (type === 'check') {
                oscillator.frequency.setValueAtTime(880, now);
                oscillator.frequency.exponentialRampToValueAtTime(440, now + 0.15);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.2, now);
            } else {
                // Standard move - click sound
                oscillator.frequency.setValueAtTime(440, now);
                oscillator.frequency.exponentialRampToValueAtTime(220, now + 0.05);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.15, now);
            }

            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

            oscillator.start(now);
            oscillator.stop(now + 0.12);

            // Clean up
            setTimeout(() => ctx.close(), 300);
        } catch (e) {
            console.warn('Sound error:', e);
        }
    }, []);


    const makeMove = useCallback((move) => {
        try {
            const result = game.move(move);
            if (result) {
                updateGameState();

                // Determine sound
                if (game.inCheck()) {
                    playSound('check');
                } else if (result.captured) {
                    playSound('capture');
                } else {
                    playSound('move');
                }

                return result;
            }
        } catch (e) {
            console.log('Invalid move', e);
            return null;
        }
        return null;
    }, [game, updateGameState, playSound]);

    const value = {
        game,
        fen,
        turn,
        isGameOver,
        gameStatus,
        history,
        makeMove,
        resetGame,
        soundEnabled,
        pendingPromotion,
        setPendingPromotion,
        gamePhase,
        startGame,
        playerColor,
        isBoardRotated,
        isAiThinking,
        aiMoveDescription,
        elapsedTime
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}
