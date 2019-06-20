import styled from 'styled-components'

const BoardWrapper = styled.div`
  position: relative;
  pointer-events: ${props => (props.preventClicks ? 'none' : 'auto')};
`

export default BoardWrapper
