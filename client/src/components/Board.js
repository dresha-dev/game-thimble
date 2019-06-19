import React, { useState, useRef, useCallback } from 'react';
import _ from 'lodash';
import * as API from '../services/api';

const NUMBER_OF_THIMBLE = 3;
const ITEM_WIDTH = 100;
const DEFAULT_SPEED = 500;

const getOrderedArray = length => _.times(length, i => i);

const Board = () => {
  const order = useRef(getOrderedArray(NUMBER_OF_THIMBLE));
  const [positions, setPosition] = useState(_.times(NUMBER_OF_THIMBLE, () => 0));
  const [speed] = useState(DEFAULT_SPEED);

  const startGame = async () => {
    // Load data
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
    const getFirstItemIndex = currentOrder.indexOf(first);
    const getLastItemIndex = currentOrder.indexOf(second);

    currentOrder[getLastItemIndex] = first;
    currentOrder[getFirstItemIndex] = second;

    const positions = _.times(NUMBER_OF_THIMBLE, index => (currentOrder[index] - index) * ITEM_WIDTH);

    setPosition(positions);
  }, []);

  const draw = useCallback((path, callback) => {
    const [first, second] = path.shift();

    getNextPositions(first, second);

    if (path.length > 0) {
      setTimeout(() => {
        draw(path, callback);
      }, speed);
    } else {
      callback();
    }
  }, []);

  return (
    <div>
      <button onClick={startGame}>Play!!!</button>

      <div>
        {getOrderedArray(NUMBER_OF_THIMBLE).map((key, index) => {
          return (
            <div
              key={key}
              style={{
                display: 'inline-block',
                width: `${ITEM_WIDTH}px`,
                transition: `all ${speed}ms ease 0s`,
                transform: `translate3d(${positions[index]}px,0,0)`
              }}
            >
              <img style={{ width: '100%' }} src="../thimble.png" alt="thimle" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;
