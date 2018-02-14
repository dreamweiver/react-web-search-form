import React, { Component } from 'react';
import axios from 'axios';
import SearchResult from './SearchResult';
import AutoSuggest from './AutoSuggest';
import {extractSearchResults, getAutoSuggestions, getWikiResults, getDuckDuckGoResults} from './helpers';

class WebSearch extends Component {
  constructor() {
    super();
    this.state = {
      search: '',
      webResults :[],
      suggestions : [],
      requestInProgress : false
    };
  }

  timer = undefined; //timer for handling debouncing logic


  // Passing in event to allow access to whatevever is typed into the textbox
  updateSearch(event, autoSuggestion) {
    const self = this;
    let searchQuery = event ? self.state.search : autoSuggestion; 
    let formattedSearchQuery = !!searchQuery ? searchQuery.replace(/\s/g,'+') : ''; 

    //api throttling:Reactive measure employed regulate network traffic on third party api.
    if(!self.state.requestInProgress && formattedSearchQuery) {
      self.setState({
        search: searchQuery,
        requestInProgress : true,
        suggestions:[]
      })

      //make ajax call to fetch web results from wiki and duckduckgo api and merge
      axios.all([getWikiResults(formattedSearchQuery), getDuckDuckGoResults(formattedSearchQuery)])
      .then(axios.spread(function (wikiResults, duckDuckGoResults) {
          //extract the search results from both and merge it
          let extractedWikiResults =  extractSearchResults(wikiResults.data, 'wiki');
          let extractedDuckDuckGoResults =  extractSearchResults(duckDuckGoResults.data, 'duckDuckGo');

          self.setState({
            webResults :extractedWikiResults.concat(extractedDuckDuckGoResults)
          });          

          //disable throttling after 1 second
          setTimeout(()=> {
            self.setState({
                  requestInProgress : false
            });          
          },1000);

          console.info("combined api web serach results:",  self.state.webResults);

      })).catch(function (error) {
        console.info(" Api calls failed, check error response for more info:",error);
      });
    }
    
  }

 
  //auto suggest web search results from google api
  autoSuggest(event) {
    if(event) {
      const searchQuery = event.target.value;
      const self = this;

      self.setState({
        search: searchQuery
      }); 

      //debounce the autosuggestions to regulate network traffic on third party api
      if(self.timer){
        clearTimeout(self.timer);
      }

      self.timer = setTimeout(() =>{
        getAutoSuggestions(searchQuery, self);     //make typeahead call via google api and show to user
      }, 1000);
    }
  }

   //clear auto suggestions when navigating away from search field
   clearAutoSuggestions() {
    setTimeout(() => {
      this.setState({
        suggestions:[]
      });
    }, 500);
   }


  render() {
    let  searchResults = this.state.webResults;
    return (
      <div>
        <div className="search_form_section"> 
            <span></span><span></span><span></span>
            <input className="search_fld" type="text" tabIndex="1" value={this.state.search} onChange={this.autoSuggest.bind(this)} onBlur={this.clearAutoSuggestions.bind(this)}/>
            <button  type="submit" onClick={this.updateSearch.bind(this)} tabIndex="2" >Submit </button> 
            <AutoSuggest suggestions = {this.state.suggestions} onSelection = {this.updateSearch.bind(this)}/>
        </div>
        <hr />
        <div>
          {searchResults.map((result, i) => {
            return <SearchResult key={i} text={result.text} iconUrl={result.apiIconUrl} redirectLink={result.url} />
          })}
        </div> 
      </div>
    )
  }
}

export default WebSearch;