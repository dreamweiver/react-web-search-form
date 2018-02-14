  import axios from 'axios';

  //format the search query to pass as url parameter
  export const formatSearchQuery = function(query) {
    return query.replace(/\s/g,'+'); 
  };

  //ajax call to fetch web results from wiki api
  export const getWikiResults = function(query) {
    const searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&origin=*&utf8=&format=json&srsearch='+query;
    return axios.get(searchUrl);
  }

  //ajax call to fetch web results from duckDuckGo api
  export const getDuckDuckGoResults = function(query){
    const searchUrl = 'http://api.duckduckgo.com/?q='+ query +'&format=json&skip_disambig=1&origin=http://localhost:3000';
    return axios.get(searchUrl);  
  }

  //extract & map the webresults for specific api type 
  export const extractSearchResults = (results, apiType) => {
    console.info("raw api results,", apiType,":", results);
    if(apiType === 'wiki') {
      return results.query.search.map( result => {
          const url = 'https://en.wikipedia.org/wiki/'+result.title;
        return {
          text : result.snippet,
          url,
          apiIconUrl : 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/220px-Wikipedia-logo-v2.svg.png'
        }
      });
    } else {
      return results.RelatedTopics.map( result => {
        return {
          text : result.Text,
          url : result.FirstURL,
          apiIconUrl : 'https://duckduckgo.com/assets/logo_header.v107.min.svg'
        }
      });

    }
  }

  //fetch auto suggestions from google api
  export const getAutoSuggestions = (searchQuery, context) => {
    const query = formatSearchQuery(searchQuery);
    const autoSuggestUrl = "http://suggestqueries.google.com/complete/search?client=chrome&q="+query;  
    const self = context;

    //call google auto suggestions api
    axios.get(autoSuggestUrl)
    .then(function (response) {
      console.info("autoSuggestions request succeeded with response,",response);
      let topSuggestions = response.data[1].slice(0,10); // show only top 10 results
      self.setState({
        suggestions : topSuggestions
      });

    })
    .catch(function (error) {
      console.info("autoSuggestions request failed with error response,",error);
    });

  }