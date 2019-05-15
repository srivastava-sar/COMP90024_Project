/*#Team 46: (Advait Mangesh Deshpande (1005024), Ansh Juneja (1027339), Saransh Srivastava (1031073), Siyu Biyan (984002), Waqar Ul Islam (1065823));
#Cities Analysed: Adelaide, Brisbane, Canberra, Geelong, Gold Coast, Melbourne, Newcastle, Perth, Sydney, Townsville*/
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
