  import axios from 'axios';

  /*Private section*/

  //format the search query to pass as url parameter
  const formatSearchQuery = query => {
    return !!query ? query.replace(/\s/g,'+') : '';
  };

  //ajax call to fetch web results from wiki api
  const getWikiResults = query => {
    const searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&origin=*&utf8=&format=json&srsearch='+query;
    return axios.get(searchUrl)
    .then(response => response.data);
  }

  //ajax call to fetch web results from duckDuckGo api
  const getDuckDuckGoResults = query => {
    const searchUrl = 'http://api.duckduckgo.com/?q='+ query +'&format=json&skip_disambig=1&origin=http://localhost:3000';
    return axios.get(searchUrl)
    .then(response => response.data);  
  }

  //extract & map the webresults for specific api type 
  export const mapSearchResults = (wikiData, duckDuckGoData) => {
    const wikiResults = wikiData.query.search.map( result => {
          const url = 'https://en.wikipedia.org/wiki/'+result.title;
        return {
          text : result.snippet,
          url,
          apiIconUrl : 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/220px-Wikipedia-logo-v2.svg.png'
        }
      });
    
    const duckDuckGoResults =  duckDuckGoData.RelatedTopics.map( result => {
        return {
          text : result.Text,
          url : result.FirstURL,
          apiIconUrl : 'https://duckduckgo.com/assets/logo_header.v107.min.svg'
        }
      });

    return wikiResults.concat(duckDuckGoResults);
  }

  /*public section*/

  // extract the web results from both wiki and duckDuckGo
  export const getWebResults = (searchQuery) => {
    let query = formatSearchQuery(searchQuery);
    // make ajax call to fetch web results from wiki and duckduckgo api and merge
    return axios.all([getWikiResults(query), getDuckDuckGoResults(query)])
    .then(axios.spread((wikiResults, duckDuckGoResults) => {
        // extract the search results from both and merge it
        let webResults =  mapSearchResults(wikiResults, duckDuckGoResults);
   
        return webResults;

    })).catch(error => {
      console.info(" Web search engine calls (wiki/duckduckgo) failed, check error response for more info:", error);
    });
  }

  // fetch auto suggestions from google api
  export const getAutoSuggestions = (searchQuery, autoSuggestionsLimit) => {
    const query = formatSearchQuery(searchQuery);
    const autoSuggestUrl = "http://suggestqueries.google.com/complete/search?client=chrome&q="+query;  

    //call google auto suggestions api
    return axios.get(autoSuggestUrl)
    .then(response => {
      let topSuggestions = response.data[1].slice(0, autoSuggestionsLimit); // show only top 10 results

      return topSuggestions;

    })
    .catch(error => {
      console.info("autoSuggestions request failed with error response,",error);
    });

  }