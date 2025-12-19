import React, { useState } from 'react';
import { useGame } from '../game/GameStateProvider';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import './UIOverlay.css';

export default function UIOverlay() {
    const {
        turn,
        gameStatus,
        history,
        resetGame,
        soundEnabled,
        pendingPromotion,
        gamePhase,
        startGame,
        isAiThinking,
        aiMoveDescription,
        elapsedTime
    } = useGame();

    // Local state for sound icon to redraw
    const [isSoundOn, setIsSoundOn] = useState(true);

    // Format time as HH:MM:SS
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Local state for difficulty
    const [selectedDifficulty, setSelectedDifficulty] = useState('standard');

    if (gamePhase === 'start') {
        return (
            <div className="ui-overlay start-screen-container">
                <div className="start-card">
                    <h1>Chess4fun</h1>

                    <div className="difficulty-section">
                        <p>Select Difficulty</p>
                        <div className="difficulty-toggle">
                            <button
                                className={selectedDifficulty === 'standard' ? 'active' : ''}
                                onClick={() => setSelectedDifficulty('standard')}
                            >
                                Standard (Mid)
                            </button>
                            <button
                                className={selectedDifficulty === 'master' ? 'active' : ''}
                                onClick={() => setSelectedDifficulty('master')}
                            >
                                Master (Adv)
                            </button>
                        </div>
                    </div>

                    <p>Choose your side</p>
                    <div className="start-buttons">
                        <button onClick={() => startGame('w', selectedDifficulty)}>Play as White</button>
                        <button onClick={() => startGame('b', selectedDifficulty)}>Play as Black</button>
                    </div>
                </div>
            </div>
        );
    }

    const isWhiteTurn = turn === 'w';

    const historyPairs = [];
    for (let i = 0; i < history.length; i += 2) {
        historyPairs.push({
            num: Math.floor(i / 2) + 1,
            white: history[i],
            black: history[i + 1] || ''
        });
    }

    const toggleSound = () => {
        soundEnabled.current = !soundEnabled.current;
        setIsSoundOn(soundEnabled.current);
    };

    return (
        <div className="ui-overlay">
            <div className="info-panel">
                <div className="header">
                    <h1>Chess4fun</h1>
                </div>

                <div className="timer">
                    <span className="timer-label">Game Time:</span>
                    <span className="timer-value">{formatTime(elapsedTime || 0)}</span>
                </div>

                <div className="status-bar">
                    <div className={`indicator ${isWhiteTurn ? 'active' : ''}`}>White</div>
                    <div className={`indicator ${!isWhiteTurn ? 'active' : ''}`}>Black</div>
                </div>

                <div className="message-area">
                    {gameStatus === 'check' && <span className="warning">Check!</span>}
                    {gameStatus === 'checkmate' && <span className="danger">Checkmate!</span>}
                    {gameStatus === 'draw' && <span className="info">Draw</span>}
                    {gameStatus === 'stalemate' && <span className="info">Stalemate</span>}
                    {isAiThinking && <div className="info">AI thinking...</div>}
                    {aiMoveDescription && <div style={{ marginTop: 5, color: '#aaa', fontStyle: 'italic' }}>{aiMoveDescription}</div>}
                </div>

                <div className="history-list">
                    {historyPairs.map((pair) => (
                        <div key={pair.num} className="history-row">
                            <span className="move-num">{pair.num}.</span>
                            <span className="move-white">{pair.white}</span>
                            <span className="move-black">{pair.black}</span>
                        </div>
                    ))}
                    {/* Auto scroll anchor could act here */}
                </div>

                <div className="controls">
                    <button className="icon-btn" onClick={resetGame} title="New Game">
                        <RotateCcw size={18} />
                    </button>
                    <button
                        className="icon-btn"
                        title="Toggle Sound"
                        onClick={toggleSound}
                    >
                        {isSoundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>
                </div>
            </div>

            {pendingPromotion && <PromotionModal />}
        </div>
    );
}

function PromotionModal() {
    const { pendingPromotion, setPendingPromotion, makeMove } = useGame();

    const handlePromote = (p) => {
        makeMove({
            from: pendingPromotion.from,
            to: pendingPromotion.to,
            promotion: p
        });
        setPendingPromotion(null);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Promote to</h3>
                <div className="promo-options">
                    <button className="promo-btn" onClick={() => handlePromote('q')}>Q</button>
                    <button className="promo-btn" onClick={() => handlePromote('r')}>R</button>
                    <button className="promo-btn" onClick={() => handlePromote('b')}>B</button>
                    <button className="promo-btn" onClick={() => handlePromote('n')}>N</button>
                </div>
            </div>
        </div>
    )
}
