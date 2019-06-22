import React from 'react'
import { GoMarkGithub } from 'react-icons/go'
import styled from 'styled-components'

const Link = styled.a`
  right: 10px;
  position: fixed;
  top: 10px;
  font-size: 24px;
  color: palevioletred;

  & :hover {
    color: purple;
  }
`

const GitLink = () => (
  <Link href="https://github.com/andrey-ponamarev/game-thimble" title="Git account andrii.ponamarov">
    <GoMarkGithub />
  </Link>
)

export default GitLink
