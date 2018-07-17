import React, {Component} from 'react';

class AutoSuggest extends Component {
   
  //load webresults for selected auto suggested option
  loadResults(currentSelection, onSelectionHandler){
    this.props.onSelection(null, currentSelection);
  }

  render() {
    if(this.props.suggestions.length > 0) {
      return (
          <div className="autoSuggest">
          {
            this.props.suggestions.map((suggestion, i) => {
       		   return <div key={i} onClick={this.loadResults.bind(this, suggestion)} >{suggestion}</div>
            })
          }
          </div>
      )
    }
    else {
      return null
    }
  }
}

export default AutoSuggest;