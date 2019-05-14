import { keyframes } from 'styled-components';


export const COLORS = {
  gray64: '#c2c2c2',
};

export const animate = keyframes`
  from {
    transform: translateY(-15%);
    opacity: 0;
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
