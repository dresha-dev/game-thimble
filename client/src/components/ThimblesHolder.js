import styled from 'styled-components'

const ThimblesHolder = styled.div`
  z-index: 1;
  position: relative;
  transition: top 500ms;
  top: ${props => (props.isBallVisible ? 0 : props.ballWidth)}px;
  margin-bottom: ${props => props.ballWidth}px;
`

export default ThimblesHolder
