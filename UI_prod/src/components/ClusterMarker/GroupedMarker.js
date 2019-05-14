import styled from 'styled-components';
import { animate } from '../../style-constants';

const GroupedMarker = styled.div`
  display: flex;
  width: ${props => (props.length === 1 ? '50px' : '50px')};
  background: #fff;
  border-radius: 100px;
  animation: ${animate} 0.2s;
  background-color: #fff;
`;

export default GroupedMarker;
