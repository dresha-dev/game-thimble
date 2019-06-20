import styled from 'styled-components'

const AnimationScreen = styled.div`
  margin: 0px auto;
  transform: translate(calc(50% - ${({ thimbleSize, thimbleCount }) => (thimbleSize * thimbleCount) / 2}px));
`

export default AnimationScreen
