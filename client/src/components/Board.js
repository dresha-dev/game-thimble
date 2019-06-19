import React, { useState, useRef, useCallback } from 'react';
import { NUMBER_OF_THIMBLES, ITEM_WIDTH, DEFAULT_SPEED, BALL_WINNING_POSITION } from '../config';
import { getOrderedArray, setZerosArray } from '../utils';
import * as API from '../services/api';
import Ball from '../components/Ball';

const Board = () => {
  const order = useRef(getOrderedArray(NUMBER_OF_THIMBLES));
  const [positions, setPosition] = useState(setZerosArray(NUMBER_OF_THIMBLES));
  const [speed] = useState(DEFAULT_SPEED);
  const [ballWinningPosition, setBallPosition] = useState(BALL_WINNING_POSITION);
  const [isBallVisible, setBallVisibility] = useState(true);

  const resetGame = () => {
    order.current = getOrderedArray(NUMBER_OF_THIMBLES);
    setPosition(setZerosArray(NUMBER_OF_THIMBLES));
    setBallPosition(BALL_WINNING_POSITION);
  };

  const startGame = async () => {
    // Load data
    resetGame();

    const path = await API.getPath();

    // LOGIC OF THE GAME
    // input |   order       |  position // index - value
    //       |  [0,1,2]      |  [ 0, 0, 0]
    // [0,2] |  [2,1,0]      |  [-2, 0, 2]
    // [2,1] |  [1,2,0]      |  [-1,-1, 2]
    // [0,1] |  [2,1,0]      |  [-2, 0, 2]

    // Hide ball

    // Shuffle
    await new Promise(resolve => {
      draw(path, resolve);
    });

    // Where is the ball?
    console.log('Where is the ball?');
  };

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

  const handleThimbleClick = selectedThimble => {
    if (selectedThimble === BALL_WINNING_POSITION) {
      // You won!!!
    } else {
      // You lose!!!
    }
  };

  return (
    <div>
      <button onClick={startGame}>Play!!!</button>
      <button
        onClick={() => {
          setBallVisibility(!isBallVisible);
        }}
      >
        Play again!!!
      </button>

      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'relative',
            transition: `top 500ms`,
            top: isBallVisible ? 0 : `${ITEM_WIDTH / 2 + 10}px`
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
    </div>
  );
};

export default Board;
