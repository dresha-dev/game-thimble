import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Board from './components/Board'

const GlobalStyle = createGlobalStyle`
  body * {
    font-family: Helvetica;
    text-align: center;
  }
  img {
    width: 100%;
  }
`

const App = () => (
  <>
    <GlobalStyle />
    <Board />
  </>
)

export default App
