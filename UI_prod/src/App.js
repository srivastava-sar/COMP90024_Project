//reference from github repo for cluster grouping of markers
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
