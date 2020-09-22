import React, { useState, useEffect } from "react";
import Snake from "./Snake";
import Food from "./Food";
import useInterval from '../library/useInterval'

const getRandCoordinates = () => {
  const min = 1;
  const max = 98;
  const x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  const y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

const Game = ({props}) => {
  const [snake, setSnake] = useState([
    [0, 0],
    [2, 0],
  ]);
  const [food, setFood] = useState(getRandCoordinates());
  const [direction, setDirection] = useState("RIGHT");
  const [speed, setSpeed] = useState(200);
  const [gamestate, setGamestate] = useState(false);

  const onKeyDown = (e) => {
    const keyPressed = String.fromCharCode(e.keyCode);
    switch (keyPressed) {
      case "w":
        setDirection("UP");
        break;
      case "s":
        setDirection("DOWN");
        break;
      case "a":
        setDirection("LEFT");
        break;
      case "d":
        setDirection("RIGHT");
        break;
    }
  };

  const moveSnake = () => {
    let dots = [...snake];
    let head = dots[dots.length - 1];

    switch (direction) {
      case "RIGHT":
        head = [head[0] + 2, head[1]];
        break;
      case "LEFT":
        head = [head[0] - 2, head[1]];
        break;
      case "UP":
        head = [head[0], head[1] - 2];
        break;
      case "DOWN":
        head = [head[0], head[1] + 2];
        break;
    }

    dots.push(head);
    dots.shift();
    setSnake(dots);
  };

  const moveByAI = (props) => {
    if (props && props.moveRight) {
      console.log(props.moveRight);
    }
  }

  useEffect(() => {
    window.addEventListener("keypress", function (e) {
      onKeyDown(e);
    });

    return () =>
      window.removeEventListener("keypress", function (e) {
        onKeyDown(e);
      });
  }, []);

  useInterval(
    () => {
      moveSnake();
      checkIfOutOfBorders();
      checkIfCollapse();
      checkIfEat();
      moveByAI(props);
    },
    gamestate ? speed : null
  );

  const onGameOver = () => {
    setGamestate(false);
    alert(`Game Over. Sanke length is ${snake.length}`);
  };

  const checkIfOutOfBorders = () => {
    const head = snake[snake.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      onGameOver();
    }
  };

  const checkIfCollapse = () => {
    const body = [...snake];
    const head = snake[snake.length - 1];
    body.pop();
    body.forEach((dot) => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        onGameOver();
      }
    });
  };

  const checkIfEat = () => {
    const head = snake[snake.length - 1];
    const enalargeSnake = () => {
      let newSnake = [...snake];
      newSnake.unshift([]);
      setSnake(newSnake);
    };
    const increaseSpeed = () => {
      if (speed > 10) {
        setSpeed(speed - 10);
      }
    };
    if (head[0] === food[0] && head[1] === food[1]) {
      setFood(getRandCoordinates());
      enalargeSnake();
      // increaseSpeed();
    }
  };

  return (
    <>
      <div className="game-area">
        <Snake snakeDots={snake} />
        <Food dot={food} />
      </div>
      <button onClick={() => setGamestate(!gamestate)}>
        Press me
      </button>
    </>
  );
}

export default Game;
