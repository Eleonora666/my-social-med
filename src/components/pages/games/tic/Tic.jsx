import React, { useState } from 'react';
import './tic.scss';

const Tic = () => {
    const [board, setBoard] = useState(Array(9).fill(''));
    const [xTurn, setXTurn] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState('');
    const [score, setScore] = useState({ X: 0, O: 0 });
    const [winningCells, setWinningCells] = useState([]);

    const winningPattern = [
        [0, 1, 2],
        [0, 3, 6],
        [2, 5, 8],
        [6, 7, 8],
        [3, 4, 5],
        [1, 4, 7],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const checkWin = (brd) => {
        for (let pattern of winningPattern) {
            const [a, b, c] = pattern;
            if (brd[a] && brd[a] === brd[b] && brd[a] === brd[c]) {
                setWinningCells([a, b, c]);
                return true;
            }
        }
        return false;
    };

    const handleClick = (index) => {
        if (gameOver || board[index] !== '') return;
    
        const newBoard = [...board];
        newBoard[index] = xTurn ? 'X' : 'O';
        setBoard(newBoard);
    
        if (checkWin(newBoard)) {
            const winner = xTurn ? 'X' : 'O';
            setMessage(`${winner} Wins!`);
            setScore({ ...score, [winner]: score[winner] + 1 });
            setGameOver(true);
        } else if (newBoard.every(cell => cell !== '')) {
            setMessage("It's a Draw!");
            setGameOver(true);
        } else {
            setXTurn(!xTurn);
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(''));
        setXTurn(true);
        setGameOver(false);
        setMessage('');
        setWinningCells([]);
    };

    return (
        <div className="wrapper">
            <div className="scoreboard">
                <p>Player X: {score.X}</p>
                <p>Player O: {score.O}</p>
            </div>

            <div className="container">
                {board.map((value, index) => (
                    <button
                        key={index}
                        className={`button-option ${winningCells.includes(index) ? 'winning-cell' : ''}`}
                        onClick={() => handleClick(index)}
                        disabled={value !== '' || gameOver}
                    >
                        {value}
                    </button>
                ))}
            </div>

            {gameOver && (
                <div className="popup">
                    <p id="message">{message}</p>
                    <button id="new-game" onClick={resetGame}>New Game</button>
                </div>
            )}

            <button id="restart" onClick={resetGame} disabled={!gameOver}>Restart</button>
        </div>
    );
};

export default Tic;
