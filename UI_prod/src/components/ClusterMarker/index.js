import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import Marker from '../Marker/index';

import GroupedMarker from './GroupedMarker';
import CounterMarker from './CounterMarker';

class MarkerCluster extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  state = {
    clusterFaceMarkers: this.props.points.slice(0, 1),
  };
  onMarkerClick = (id) => {
    this.props.onMarkerClick(id);
  }
  render() {
    return (
      <GroupedMarker length={this.props.points.length}>
        {this.state.clusterFaceMarkers.map(marker =>
          <Marker
            key={marker.id}
            lat={marker.lat}
            lng={marker.lng}
            name={marker.id}
            inGroup
            onMarkerClick={()=>this.props.onMarkerClick(marker.id,marker.lat,marker.lng,marker.city,marker.sentiment,marker.sentimentValue)}
          />
        )}
        {this.props.points.length > 1 &&
          <CounterMarker>
            +{this.props.points.length - 1}
          </CounterMarker>}
      </GroupedMarker>
    );
  }
}

MarkerCluster.propTypes = {
  points: PropTypes.array,
  users: PropTypes.instanceOf(List),
  selected: PropTypes.bool,
};

export default MarkerCluster;
