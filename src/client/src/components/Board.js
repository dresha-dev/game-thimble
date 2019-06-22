import React, { useState, useRef, useCallback } from 'react'
import { NUMBER_OF_THIMBLES, ITEM_WIDTH, DEFAULT_SPEED, BALL_WINNING_POSITION } from '../config'
import { getOrderedArray, setZerosArray, delay } from '../utils'
import * as API from '../services/api'
import Button from './Button'
import Thimble from './Thimble'
import Ball from './Ball'
import ThimblesHolder from './ThimblesHolder'
import Dialog from './Dialog'
import BoardWrapper from './BoardWrapper'
import AnimationScreen from './AnimationScreen'
import GitLink from './GitLink'

const Board = () => {
  const order = useRef(getOrderedArray(NUMBER_OF_THIMBLES)) // Thimbles order
  const [positions, setPosition] = useState(setZerosArray(NUMBER_OF_THIMBLES)) // Thimbles css position
  const [speed, setSpeed] = useState(DEFAULT_SPEED) // Game speed
  const [ballWinningPosition, setBallPosition] = useState(BALL_WINNING_POSITION) // Ball position under container
  const [isBallVisible, setBallVisibility] = useState(true) // Shows ball visibillity
  const [message, setMessage] = useState(`Let's have a fun!`) // Game result message
  const [gameStatus, setGameStatus] = useState('ready') // Game sta
  /**
   * Reset game to the default state
   */
  const resetGame = async () => {
    setSpeed(0)
    order.current = getOrderedArray(NUMBER_OF_THIMBLES)
    setPosition(setZerosArray(NUMBER_OF_THIMBLES))
    setBallPosition(BALL_WINNING_POSITION)
    setMessage('Loading...')
    await delay(DEFAULT_SPEED) // Delay is needed for returning ball to the default position
    setSpeed(DEFAULT_SPEED)
  }

  /**
   * Load and animate shuffle path
   */
  const startGame = async () => {
    if (gameStatus === 'loading') {
      return
    }

    await resetGame() // Reset components to starting position
    setGameStatus('loading') // Prevent user clicks
    setBallVisibility(false) // Hide ball
    const path = await API.getPath() // Get path from server
    if (path === null) {
      setGameStatus('ready')
      setMessage('Server error, please try again!')
      return
    }
    setMessage('Shuffle...')
    await delay(DEFAULT_SPEED) // Delay is needed for hiding ball before shuffle
    await new Promise(resolve => draw(path, resolve)) // Animate shuffle
    setGameStatus('loaded') // Allow user choose thimble
    setMessage('Where is the ball?')
  }

  /**
   * Calculate thimbles and ball positions
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
      state[value] = (index - value) * 100
      return state
    }, [])

    setPosition(positions)
    setBallPosition(BallPosition)
  }, [])

  /**
   * Show animated shulle by givven path
   */
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

  /**
   * Handle click by clicked thimble
   * @param {Number} selectedThimble Index of clicked thimble
   */
  const handleThimbleClick = async selectedThimble => {
    setBallVisibility(true)
    await delay(300)

    if (selectedThimble === BALL_WINNING_POSITION) {
      setMessage('🥳 Awesome! 🤩')
    } else {
      setMessage('😫 Ops!')
    }
    setGameStatus('ready')
  }

  return (
    <>
      <Dialog>{message}</Dialog>

      <Button disabled={gameStatus !== 'ready'} onClick={startGame}>
        Play
      </Button>

      <AnimationScreen thimbleSize={ITEM_WIDTH} thimbleCount={NUMBER_OF_THIMBLES}>
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
      </AnimationScreen>

      <GitLink />
    </>
  )
}

export default Board
