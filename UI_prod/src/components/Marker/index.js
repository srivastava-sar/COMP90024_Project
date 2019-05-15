/*#Team 46: (Advait Mangesh Deshpande (1005024), Ansh Juneja (1027339), Saransh Srivastava (1031073), Siyu Biyan (984002), Waqar Ul Islam (1065823));
#Cities Analysed: Adelaide, Brisbane, Canberra, Geelong, Gold Coast, Melbourne, Newcastle, Perth, Sydney, Townsville*/
import React from 'react';
import PropTypes from 'prop-types';

import MarkerInGroupStyled from './MarkerInGroupStyled';

class Marker extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  static defaultProps = {
    inGroup: false,
  };

  onMarkerClick = (id, lat, lng, city, sentiment, sentimentValue) => {
    this.props.onMarkerClick(id, lat, lng, city, sentiment, sentimentValue);
  }

  render() {
    return (
      <div>
        
        <MarkerInGroupStyled>
          <button
            onClick={() => { this.onMarkerClick(this.props.id, this.props.lat, this.props.lng, this.props.city, this.props.sentiment, this.props.sentimentValue) }} style={{ backgroundColor: 'Transparent', cursor: 'pointer', border: 'none', outline: 'none' }}><img src={require('../../Assets/images/icons8-user-location-30.png')} alt={"broken"}></img></button>
        </MarkerInGroupStyled>

      </div>
    );
  }
}

Marker.propTypes = {
  inGroup: PropTypes.bool,
};

export default Marker;
