import React, {Component} from 'react';
import striptags from 'striptags'; //used for stripping html tags from wiki api web result

//Search result component to show the logo + web text 
class SearchResult extends Component {
  render() {
  	let {props} = this;
    return (
      <div className="row">
   		   <div className="logo-section">
   		   		<img className="api_logo" src={props.iconUrl} alt={props.iconUrl} />
   		   </div>
   		   <div className="text_section">
   		   		<a target="_blank" href={props.redirectLink}> {striptags(props.text)} </a>
   		   	</div>
      </div>
    )
  }
}

export default SearchResult;