import React, { useState } from 'react';
import './puzzle.scss';

const N = 4; // Размер пазла NxN, где N = 4 для 15 пазла

// Генерация начальной последовательности чисел для пазла
const generateBoard = () => {
  const numbers = [...Array(N * N - 1).keys()].map((n) => n + 1); // 1, 2, ..., 15
  numbers.push(null); // Пустое место в пазле
  return shuffle(numbers);
};

// Перемешивание массива
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Проверка на выигрыш
const isWin = (board) => {
  for (let i = 0; i < N * N - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[N * N - 1] === null;
};

function Puzzle() {
  const [board, setBoard] = useState(generateBoard());
  const [emptyIndex, setEmptyIndex] = useState(board.indexOf(null));

  const moveTile = (index) => {
    // Проверка, что соседний элемент пустой
    const isNeighbor = [
      emptyIndex - 1, emptyIndex + 1, emptyIndex - N, emptyIndex + N,
    ].includes(index);

    if (!isNeighbor) return;

    const newBoard = [...board];
    newBoard[emptyIndex] = newBoard[index];
    newBoard[index] = null;
    setBoard(newBoard);
    setEmptyIndex(index);
  };

  const restartGame = () => {
    const newBoard = generateBoard();
    setBoard(newBoard);
    setEmptyIndex(newBoard.indexOf(null));
  };

  return (
    <div className="game-container2">
      <h1>15 Puzzle</h1>
      <div className="board2">
        {board.map((tile, index) => (
          <div
            key={index}
            className={`tile ${tile === null ? 'empty' : ''}`}
            onClick={() => moveTile(index)}
          >
            {tile}
          </div>
        ))}
      </div>
      {isWin(board) && <div className="win-message">You Win!</div>}
      <button className="restart-button" onClick={restartGame}>Restart Game</button>
    </div>
  );
}

export default Puzzle;