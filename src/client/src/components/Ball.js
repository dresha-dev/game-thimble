import React from 'react'
import { ITEM_WIDTH, GAME_SPEED } from '../config'
import styled from 'styled-components'

const BallImageWrapper = styled.div`
  position: absolute;
  bottom: -${ITEM_WIDTH / 2 - 10}px;
  left: ${props => props.position * ITEM_WIDTH}px;
  width: ${ITEM_WIDTH / 2}px;
  transform: translate(50%);
  transition: all ${GAME_SPEED}ms ease 0s;
`
const Ball = ({ position }) => (
  <BallImageWrapper position={position}>
    <img src="../images/ball.png" alt="ball" />
  </BallImageWrapper>
)

export default Ball
