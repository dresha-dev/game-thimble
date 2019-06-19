import React, { useState, useRef, useCallback } from 'react';
import _ from 'lodash';
import * as API from '../services/api';

const NUMBER_OF_THIMBLES = 3;
const ITEM_WIDTH = 100;
const DEFAULT_SPEED = 500;
const BALL_WINNING_POSITION = 1;

const getOrderedArray = length => _.times(length, i => i);
const setZerosArray = length => _.times(length, () => 0);

const Ball = ({ position }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 0,
      left: `${position * ITEM_WIDTH}px`,
      width: `${ITEM_WIDTH / 2}px`,
      transform: 'translate(50%)',
      transition: `all ${DEFAULT_SPEED}ms ease 0s`
    }}
  >
    <img style={{ width: '100%' }} src="../images/ball.png" alt="ball" />
  </div>
);

const Board = () => {
  const order = useRef(getOrderedArray(NUMBER_OF_THIMBLES));
  const [positions, setPosition] = useState(setZerosArray(NUMBER_OF_THIMBLES));
  const [speed] = useState(DEFAULT_SPEED);
  const [ballWinningPosition, setBallPosition] = useState(BALL_WINNING_POSITION);

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
      <button onClick={startGame}>Play again!!!</button>

      <div style={{ position: 'relative' }}>
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
        <Ball position={ballWinningPosition} />
      </div>
    </div>
  );
};

export default Board;
