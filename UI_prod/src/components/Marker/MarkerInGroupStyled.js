/*#Team 46: (Advait Mangesh Deshpande (1005024), Ansh Juneja (1027339), Saransh Srivastava (1031073), Siyu Biyan (984002), Waqar Ul Islam (1065823));
#Cities Analysed: Adelaide, Brisbane, Canberra, Geelong, Gold Coast, Melbourne, Newcastle, Perth, Sydney, Townsville*/
import styled from 'styled-components';
import { COLORS } from '../../style-constants';

const MarkerInGroupStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  margin-left: -7px;
  font-size: 14px;
  color: #fff;
  text-transform: uppercase;
  border: 2px solid #fff;
  border-radius: 50%;
  background-color: ${COLORS.gray64};
  background-size: cover;
  background-position: center;
`;

export default MarkerInGroupStyled;
