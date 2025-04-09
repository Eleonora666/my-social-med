import React, { useState, useEffect } from "react";
import "./snake.scss";

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: 1 };
const FOOD_POSITION = () => ({
  x: Math.floor(Math.random() * BOARD_SIZE),
  y: Math.floor(Math.random() * BOARD_SIZE),
});

const Snake = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(FOOD_POSITION);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;
    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= BOARD_SIZE ||
          newHead.y < 0 ||
          newHead.y >= BOARD_SIZE ||
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(FOOD_POSITION);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction]);
  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(FOOD_POSITION);
    setGameOver(false);
  };
  return (
    <div className="game-containers">
      <div className="game-content">
        {gameOver && <div className="game-over">Game Over</div>}
        <div className="board">
          {Array.from({ length: BOARD_SIZE }).map((_, row) => (
            <div key={row} className="row2">
              {Array.from({ length: BOARD_SIZE }).map((_, col) => {
                const isSnake = snake.some((segment) => segment.x === col && segment.y === row);
                const isFood = food.x === col && food.y === row;
                return <div key={col} className={`cell ${isSnake ? "snake" : ""} ${isFood ? "food" : ""}`}></div>;
              })}
            </div>
          ))}
        </div>
        <div className="button-rest">{gameOver && <button className="restart-button" onClick={restartGame}>Restart Game</button>}</div>
      </div>
    </div>
  );
};

export default Snake;
