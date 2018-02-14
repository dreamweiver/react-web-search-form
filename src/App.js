import React, { Component } from 'react';
import './App.css';
import WebSearch from './WebSearch.js'

//main container component which load webSearch component
class App extends Component {
  render() {
    return (
      <div className="App">
        <WebSearch /> 
      </div>
    );
  }
}

export default App;
