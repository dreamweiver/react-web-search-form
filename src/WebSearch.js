import React, { Component } from 'react';
import SearchResult from './SearchResult';
import {AutoSuggest} from './AutoSuggest';
import {getWebResults, getAutoSuggestions} from './helpers';

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

	_autoSuggestionsLimit = 10;

	timer = undefined; //timer for handling debouncing logic


	// Passing in event to allow access to whatevever is typed into the textbox
	updateSearch(event, autoSuggestion) {
		const self = this;
		let searchQuery = event ? self.state.search : autoSuggestion; 

		//api throttling:Reactive measure employed to regulate network traffic on third party api.
		if(!self.state.requestInProgress && searchQuery) {
			self.setState({
				search: searchQuery,
				requestInProgress : true,
				suggestions:[]
			})

			// make ajax call to fetch web results from wiki and duckduckgo api and merge
			getWebResults(searchQuery)
			.then((webResults) =>{
				self.setState({
					webResults
				});          

				//disable throttling after 1 second
				setTimeout(()=> {
					self.setState({
						requestInProgress : false
					});          
				},1000);

				console.info("combined api web serach results:",  self.state.webResults);

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

			self.timer = setTimeout(() => {
				debugger;
				//make typeahead call via google api and show to user
				getAutoSuggestions(searchQuery, self._autoSuggestionsLimit)
				.then( suggestions => {
 					self.setState({
						suggestions
					});
				})
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
						<div className="logo">
							<span></span><span></span><span></span>
						</div> 
						<div className="interaction_section">
							<div className="fields">
								<input className="search_fld" type="text" tabIndex="1" value={this.state.search} onChange={this.autoSuggest.bind(this)} onBlur={this.clearAutoSuggestions.bind(this)}/>
								<button  type="submit" onClick={this.updateSearch.bind(this)} tabIndex="2" > Search </button>
							</div>
							<AutoSuggest suggestions = {this.state.suggestions} onSelection = {this.updateSearch.bind(this)}/>
						</div>
				</div>
				<hr />
				<div className="search_results">
					{searchResults.map((result, i) => {
						return <SearchResult key={i} text={result.text} iconUrl={result.apiIconUrl} redirectLink={result.url} />
					})}
				</div> 
			</div>
		)
	}
}

export default WebSearch;