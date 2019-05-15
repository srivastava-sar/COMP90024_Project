//reference from github repo for cluster grouping of markers
/*#Team 46: (Advait Mangesh Deshpande (1005024), Ansh Juneja (1027339), Saransh Srivastava (1031073), Siyu Biyan (984002), Waqar Ul Islam (1065823));
#Cities Analysed: Adelaide, Brisbane, Canberra, Geelong, Gold Coast, Melbourne, Newcastle, Perth, Sydney, Townsville*/
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Map from './components/Map';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
      <div className="App">
        <Map />
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
