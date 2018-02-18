import React, {Component} from 'react';

class AutoSuggest extends Component {
   
  //load webresults for selected auto suggested option
  loadResults(currentSelection, onSelectionHandler){
    console.info("current onSelection:", currentSelection);
    this.props.onSelection(null, currentSelection);
  }

  render() {
    return (
      <div className="autoSuggest">
      {this.props.suggestions.map((suggestion, i) => {
   		   return <div key={i} onClick={this.loadResults.bind(this, suggestion)} >{suggestion}</div>
      })}
      </div>
    )
  }
}

export default AutoSuggest;