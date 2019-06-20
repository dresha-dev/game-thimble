import React, { useState, useRef, useCallback } from 'react'
import { NUMBER_OF_THIMBLES, ITEM_WIDTH, DEFAULT_SPEED, BALL_WINNING_POSITION } from '../config'
import { getOrderedArray, setZerosArray, delay } from '../utils'
import * as API from '../services/api'
import Button from '../components/Button'
import Thimble from '../components/Thimble'
import Ball from '../components/Ball'
import ThimblesHolder from '../components/ThimblesHolder'
import Dialog from '../components/Dialog'
import BoardWrapper from '../components/BoardWrapper'

import styled from 'styled-components'

const Board = () => {
  const order = useRef(getOrderedArray(NUMBER_OF_THIMBLES)) // Thimbles order
  const [positions, setPosition] = useState(setZerosArray(NUMBER_OF_THIMBLES)) // Thimbles css position
  const [speed] = useState(DEFAULT_SPEED) // Game speed
  const [ballWinningPosition, setBallPosition] = useState(BALL_WINNING_POSITION) // Ball position under container
  const [isBallVisible, setBallVisibility] = useState(true) // Shows ball visibillity
  const [message, setMessage] = useState(`Let's have a fun!`) // Game result message
  const [gameStatus, setGameStatus] = useState('ready') // Game sta

  /**
   * Reset game to the default state
   */
  const resetGame = () => {
    order.current = getOrderedArray(NUMBER_OF_THIMBLES)
    setPosition(setZerosArray(NUMBER_OF_THIMBLES))
    setBallPosition(BALL_WINNING_POSITION)
    setMessage('')
  }

  /**
   * Load and animate shuffle path
   */
  const startGame = async () => {
    if (gameStatus === 'loading') {
      return
    }
    setGameStatus('loading') // Prevent user clicks
    resetGame() // Reset components to starting position
    await delay(500)
    setBallVisibility(false) // Hide ball
    const path = await API.getPath() // Get path from server

    await delay(500) // Delay is needed for hiding ball before shuffle
    await new Promise(resolve => draw(path, resolve)) // Animate shuffle
    setGameStatus('loaded') // Allow user choose thimble
  }

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
    const currentOrder = order.current
    const valueOfFirst = currentOrder[first]
    const valueOfSecond = currentOrder[second]

    currentOrder[second] = valueOfFirst
    currentOrder[first] = valueOfSecond

    const BallPosition = currentOrder.indexOf(BALL_WINNING_POSITION)
    const positions = currentOrder.reduce((state, value, index) => {
      state[value] = (index - value) * ITEM_WIDTH
      return state
    }, [])

    setPosition(positions)
    setBallPosition(BallPosition)
  }, [])

  const draw = useCallback(
    (path, callback) => {
      const [first, second] = path.shift()

      getNextPositions(first, second)

      if (path.length > 0) {
        setTimeout(() => {
          draw(path, callback)
        }, speed)
      } else {
        callback()
      }
    },
    [getNextPositions, speed]
  )

  const handleThimbleClick = async selectedThimble => {
    setBallVisibility(true)
    await delay(300)

    if (selectedThimble === BALL_WINNING_POSITION) {
      setMessage('Awesome! 🤩')
    } else {
      setMessage('Ops! 😫')
    }
    setGameStatus('ready')
  }

  return (
    <>
      <BoardWrapper preventClicks={gameStatus === 'loading' || gameStatus === 'ready'}>
        <ThimblesHolder isBallVisible={isBallVisible} ballWidth={ITEM_WIDTH / 2 + 10}>
          {getOrderedArray(NUMBER_OF_THIMBLES).map((key, index) => (
            <Thimble
              onClick={() => handleThimbleClick(key)}
              shuffleSpeed={speed}
              key={key}
              translateX={positions[index]}
              ballWidth={ITEM_WIDTH}
            >
              <img src="../images/thimble.png" alt="thimble" />
            </Thimble>
          ))}
        </ThimblesHolder>
        <Ball position={ballWinningPosition} />
      </BoardWrapper>
      <Button disabled={gameStatus !== 'ready'} onClick={startGame}>
        Play!
      </Button>
      <Dialog>{message}</Dialog>
    </>
  )
}

export default Board
