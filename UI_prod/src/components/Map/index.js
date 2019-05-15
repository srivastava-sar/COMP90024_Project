/*#Team 46: (Advait Mangesh Deshpande (1005024), Ansh Juneja (1027339), Saransh Srivastava (1031073), Siyu Biyan (984002), Waqar Ul Islam (1065823));
#Cities Analysed: Adelaide, Brisbane, Canberra, Geelong, Gold Coast, Melbourne, Newcastle, Perth, Sydney, Townsville*/
import React from 'react';
import GoogleMapReact from 'google-map-react';
import supercluster from 'points-cluster';
import Marker from '../Marker';
import $ from 'jquery';
import AnalysisContainer from '../Analysis';
import AnalysisDataContainer from '../AnalysisDataContainer/index';

const australiaCoords = { lat: -26.4390917, lng: 133.281323 }

const MAP = {
  defaultZoom: 4,
  defaultCenter: australiaCoords,
  options: {
    maxZoom: 12,
    fullscreenControl: false
  },


};

export class GoogleMap extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  state = {
    mapOptions: {
      center: MAP.defaultCenter,
      zoom: MAP.defaultZoom,
    },
    clusters: [],
    latLngsArrayData: [],
    dataLoaded: false,
    isMarkerClicked: false,
    markerClicked: [],
    city: '',
    AnalysisDataContainerDisplay: false,
    showInfoBox: false,
    infoBoxPosition: {},
    displayMoreGraph : false,

  };

  getAllClusterMarkers = () => {
    const clustersMarkers = supercluster(this.state.latLngsArrayData, {
      minZoom: 0,
      maxZoom: 9
    });

    return clustersMarkers(this.state.mapOptions);
  };

  onMarkerClick = (id, lat, lng, city, sentimentValue, sentiment) => {
    const allData = this.state.latLngsArrayData;
    this.setState({
      isMarkerClicked: true,
      markerClicked: {
        id,
        lat,
        lng: lng,
        city: city,
        sentimentValue: sentimentValue,
        sentiment: sentiment,
        data: allData
      },
      city: city,
      AnalysisDataContainerDisplay: true,
    })
  }

  componentDidMount() {
    var adata = []
    $.ajax({
      url: 'http://admin:admin@103.6.254.21:5984/tweets_prod_v3/_design/location_v1/_view/new-view?reduce=true&group=true',
      type: 'get',
      dataType: 'json'
    }).then(data => {
      if (data.hasOwnProperty("rows")) {
        for (let index = 0; index < data.rows.length; index++) {
          if (data.rows[index].value !== null) {
            if (data.rows[index].key[0].includes('Melbourne') || data.rows[index].key[0].includes('Fitzroy') || data.rows[index].key[0].includes('melbourne')) {
              const el = {
                id: index,
                city: 'Melbourne',
                lat: data.rows[index].key[1],
                lng: data.rows[index].key[2],
                sentiment: data.rows[index].key[3],
                sentimentValue: data.rows[index].value
              }
              adata.push(el)
            }
            else if (data.rows[index].key[0].includes('Sydney') || data.rows[index].key[0].includes('sydney')) {
              const el = {
                id: index,
                city: 'Sydney',
                lat: data.rows[index].key[1],
                lng: data.rows[index].key[2],
                sentiment: data.rows[index].key[3],
                sentimentValue: data.rows[index].value
              }
              adata.push(el)
            }
            else if (data.rows[index].key[0].includes('Adelaide') || data.rows[index].key[0].includes('adelaide')) {
              const el = {
                id: index,
                city: 'Adelaide',
                lat: data.rows[index].key[1],
                lng: data.rows[index].key[2],
                sentiment: data.rows[index].key[3],
                sentimentValue: data.rows[index].value
              }
              adata.push(el)
            }
            else if (data.rows[index].key[0].includes('Perth') || data.rows[index].key[0].includes('perth')) {
              const el = {
                id: index,
                city: 'Perth',
                lat: data.rows[index].key[1],
                lng: data.rows[index].key[2],
                sentiment: data.rows[index].key[3],
                sentimentValue: data.rows[index].value
              }
              adata.push(el)
            }
            else if (data.rows[index].key[0].includes('Brisbane') || data.rows[index].key[0].includes('brisbane')) {
              const el = {
                id: index,
                city: 'Brisbane',
                lat: data.rows[index].key[1],
                lng: data.rows[index].key[2],
                sentiment: data.rows[index].key[3],
                sentimentValue: data.rows[index].value
              }
              adata.push(el)
            }
            else if (data.rows[index].key[0].includes('Gold Coast') || data.rows[index].key[0].includes('gold coast')) {
              const el = {
                id: index,
                city: 'Gold Coast',
                lat: data.rows[index].key[1],
                lng: data.rows[index].key[2],
                sentiment: data.rows[index].key[3],
                sentimentValue: data.rows[index].value
              }
              adata.push(el)
            }
            else if (data.rows[index].key[0].includes('New Castle') || data.rows[index].key[0].includes('new castle') || data.rows[index].key[0].includes('Newcastle') || data.rows[index].key[0].includes('newcastle')) {
              const el = {
                id: index,
                city: 'New Castle',
                lat: data.rows[index].key[1],
                lng: data.rows[index].key[2],
                sentiment: data.rows[index].key[3],
                sentimentValue: data.rows[index].value
              }
              adata.push(el)
            }
            else if (data.rows[index].key[0].includes('Canberra') || data.rows[index].key[0].includes('canberra') || data.rows[index].key[0].includes('#CBR')) {
              const el = {
                id: index,
                city: 'Canberra',
                lat: data.rows[index].key[1],
                lng: data.rows[index].key[2],
                sentiment: data.rows[index].key[3],
                sentimentValue: data.rows[index].value
              }
              adata.push(el)
            }
            else if (data.rows[index].key[0].includes('Gosford') || data.rows[index].key[0].includes('gosford')) {
              const el = {
                id: index,
                city: 'Gosford',
                lat: data.rows[index].key[1],
                lng: data.rows[index].key[2],
                sentiment: data.rows[index].key[3],
                sentimentValue: data.rows[index].value
              }
              adata.push(el)
            }
            else if (data.rows[index].key[0].includes('Wollongong') || data.rows[index].key[0].includes('wollongong')) {
              const el = {
                id: index,
                city: 'Wollongong',
                lat: data.rows[index].key[1],
                lng: data.rows[index].key[2],
                sentiment: data.rows[index].key[3],
                sentimentValue: data.rows[index].value
              }
              adata.push(el)
            }
            else if (data.rows[index].key[0].includes('Northern Territory') || data.rows[index].key[0].includes('northern territory')) {
              const el = {
                id: index,
                city: 'Northern Territory',
                lat: data.rows[index].key[1],
                lng: data.rows[index].key[2],
                sentiment: data.rows[index].key[3],
                sentimentValue: data.rows[index].value
              }
              adata.push(el)
            }
            else if (data.rows[index].key[0].includes('Townsville') || data.rows[index].key[0].includes('townsville')) {
              const el = {
                id: index,
                city: 'Townsville',
                lat: data.rows[index].key[1],
                lng: data.rows[index].key[2],
                sentiment: data.rows[index].key[3],
                sentimentValue: data.rows[index].value
              }
              adata.push(el)
            }
          }
          else {
            continue;
          }

        }

        this.setState({ latLngsArrayData: adata, dataLoaded: true });
        this.createMarkerCluster(this.props);
      }
    }).catch(err => {
      alert('Something went wrong, Please try again');
    });


  }

  createMarkerCluster = props => {
    this.setState({
      clusters: this.state.mapOptions.bounds
        ? this.getAllClusterMarkers(props).map(({ lng, lat, numPoints, points }) => ({
          lat: lat,
          lng: lng,
          numPoints,
          id: `${numPoints}_${points[0].id}`,
          points,
        }))
        : [],
    });
  };

  handleMapChange = ({ center, zoom, bounds }) => {
    this.setState(
      {
        mapOptions: {
          center,
          zoom,
          bounds,
        },
      },
      () => {
        this.createMarkerCluster(this.props);
      }
    );
  };


  render() {
    return (
      <div>
        <span style={{fontWeight:700,fontSize:20,textAlign:'center'}}>
          <p style={{padding:10}}>
            Analysis of Exercising Trends in Urban Australia
          </p>
          <span style={{fontWeight:700,fontSize:10,textAlign:'center'}}>
            <p>
              (click on the map marker to get the data)
            </p>
          </span>
          </span>
        <div style={{ margin: 10 }}>
          <div style={{ width: this.state.AnalysisDataContainerDisplay ? '50%' : '100%', height: '75%', float: 'left', marginRight: 10 }}>
            <div style={{ height: 400, width: '100%' }}>
              <GoogleMapReact
                ref={(ref) => { this.map = ref; }}
                defaultZoom={MAP.defaultZoom}
                defaultCenter={MAP.defaultCenter}
                options={MAP.options}
                onChange={this.handleMapChange}
                yesIWantToUseGoogleMapApiInternals
                bootstrapURLKeys={{ key: 'AIzaSyBZHgvSAwAB3OmZ-GRX115M90gp81nQ-Ks' }}
              >
                {this.state.dataLoaded && this.state.clusters.map(item => {
                  return (
                    <Marker
                      key={item.id}
                      id={item.id}
                      lat={item.points[0].lat}
                      lng={item.points[0].lng}
                      onMarkerClick={this.onMarkerClick}
                      city={item.points[0].city}
                      sentiment={item.points[0].sentiment}
                      sentimentValue={item.points[0].sentimentValue}
                    />
                  );
                })}
              </GoogleMapReact>

            </div>

          </div>
          <div style={{
            width: this.state.AnalysisDataContainerDisplay ? '50%' : 0, height: 400, float: 'right',
            display: this.state.AnalysisDataContainerDisplay ? 'contents' : ''
          }}>
            {this.state.AnalysisDataContainerDisplay && <AnalysisDataContainer isMarkerClicked={this.state.AnalysisDataContainerDisplay}
              city={this.state.city}
              selectedMarker={this.state.markerClicked}
            />
            }
          </div>


        </div>
        <div style={{ marginTop: 10 }}>

          {this.state.isMarkerClicked && <AnalysisContainer isMarkerClicked={this.state.isMarkerClicked}
            selectedMarker={this.state.markerClicked}
          />}
        </div>
      </div>
    );
  }
}

export default GoogleMap;
