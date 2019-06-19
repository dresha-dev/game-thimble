import React from 'react';
import { ITEM_WIDTH, DEFAULT_SPEED } from '../config';

const Ball = ({ position }) => (
  <div
    style={{
      position: 'absolute',
      bottom: `-${ITEM_WIDTH / 2}px`,
      left: `${position * ITEM_WIDTH}px`,
      width: `${ITEM_WIDTH / 2}px`,
      transform: 'translate(50%)',
      transition: `all ${DEFAULT_SPEED}ms ease 0s`
    }}
  >
    <img style={{ width: '100%' }} src="../images/ball.png" alt="ball" />
  </div>
);

export default Ball;
