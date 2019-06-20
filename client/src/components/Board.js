import React, { useState, useRef, useCallback } from 'react';
import { NUMBER_OF_THIMBLES, ITEM_WIDTH, DEFAULT_SPEED, BALL_WINNING_POSITION } from '../config';
import { getOrderedArray, setZerosArray, delay } from '../utils';
import * as API from '../services/api';
import Ball from '../components/Ball';

const Board = () => {
  const order = useRef(getOrderedArray(NUMBER_OF_THIMBLES)); // Thimbles order
  const [positions, setPosition] = useState(setZerosArray(NUMBER_OF_THIMBLES)); // Thimbles css position
  const [speed] = useState(DEFAULT_SPEED); // Game speed
  const [ballWinningPosition, setBallPosition] = useState(BALL_WINNING_POSITION); // Ball position under container
  const [isBallVisible, setBallVisibility] = useState(true); // Shows ball visibillity
  const [gameResult, setGameResult] = useState(''); // Game result message
  const [gameStatus, setGameStatus] = useState('ready'); // Game sta

  /**
   * Reset game to the default state
   */
  const resetGame = () => {
    order.current = getOrderedArray(NUMBER_OF_THIMBLES);
    setPosition(setZerosArray(NUMBER_OF_THIMBLES));
    setBallPosition(BALL_WINNING_POSITION);
    setGameResult('');
  };

  /**
   * Load and animate shuffle path
   */
  const startGame = async () => {
    if (gameStatus === 'loading') {
      return;
    }
    setGameStatus('loading'); // Prevent user clicks
    resetGame(); // Reset components to starting position
    const path = await API.getPath(); // Get path from server
    setBallVisibility(false); // Hide ball
    await delay(500); // Delay is needed for hiding ball before shuffle
    await new Promise(resolve => draw(path, resolve)); // Animate shuffle
    setGameStatus('loaded'); // Allow user choose thimble
  };

  /**
   * Calculate thimbles and ball position
   * @example
   *  move |   order       |  position
   *       |  [0,1,2]      |  [ 0, 0, 0] // Default position
   * [0,2] |  [2,1,0]      |  [-2, 0, 2]
   * [2,1] |  [1,2,0]      |  [-1,-1, 2]
   * [0,1] |  [2,1,0]      |  [-2, 0, 2]
   */
  const getNextPositions = useCallback((first, second) => {
    const currentOrder = order.current;
    const valueOfFirst = currentOrder[first];
    const valueOfSecond = currentOrder[second];

    currentOrder[second] = valueOfFirst;
    currentOrder[first] = valueOfSecond;

    const BallPosition = currentOrder.indexOf(BALL_WINNING_POSITION);
    const positions = currentOrder.reduce((state, value, index) => {
      state[value] = (index - value) * ITEM_WIDTH;
      return state;
    }, []);

    setPosition(positions);
    setBallPosition(BallPosition);
  }, []);

  const draw = useCallback(
    (path, callback) => {
      const [first, second] = path.shift();

      getNextPositions(first, second);

      if (path.length > 0) {
        setTimeout(() => {
          draw(path, callback);
        }, speed);
      } else {
        callback();
      }
    },
    [getNextPositions, speed]
  );

  const handleThimbleClick = async selectedThimble => {
    setBallVisibility(true);
    await delay(300);

    if (selectedThimble === BALL_WINNING_POSITION) {
      setGameResult('Awesome! 🤩');
    } else {
      setGameResult('Ops! 😫');
    }
    setGameStatus('ready');
  };

  return (
    <div>
      <div
        style={{
          position: 'relative',
          pointerEvents: gameStatus === 'loading' || gameStatus === 'ready' ? 'none' : 'auto'
        }}
      >
        <div
          style={{
            position: 'relative',
            transition: `top 500ms`,
            top: isBallVisible ? 0 : `${ITEM_WIDTH / 2 + 10}px`,
            marginBottom: `${ITEM_WIDTH / 2 + 10}px`
          }}
        >
          {getOrderedArray(NUMBER_OF_THIMBLES).map((key, index) => {
            return (
              <div
                onClick={() => handleThimbleClick(key)}
                key={key}
                style={{
                  zIndex: 1,
                  display: 'inline-block',
                  position: 'relative',
                  width: `${ITEM_WIDTH}px`,
                  transition: `all ${speed}ms ease 0s`,
                  transform: `translate(${positions[index]}px)`
                }}
              >
                <img style={{ width: '100%' }} src="../images/thimble.png" alt="thimle" />
              </div>
            );
          })}
        </div>
        <Ball position={ballWinningPosition} />
      </div>
      {gameResult !== '' && <div>{gameResult}</div>}
      <button onClick={startGame}>Let's play!</button>
    </div>
  );
};

export default Board;
