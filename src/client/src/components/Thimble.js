import styled from 'styled-components'

const Thimble = styled.div`
  display: inline-block;
  width: ${props => props.ballWidth}px;
  transition: all ${props => props.shuffleSpeed}ms ease 0s;
  transform: translate(${props => props.translateX}px);
  padding: 10px;
  box-sizing: border-box;

  img {
    width: 100%;
  }
`

export default Thimble
