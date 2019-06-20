import styled from 'styled-components';

const Button = styled.button`
  background: palevioletred;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: white;
  margin: 0 1em;
  padding: 0.25em 1em;
  font-size: 20px;

  &:disabled {
    opacity: 0.3;
  }
`;

export default Button;
