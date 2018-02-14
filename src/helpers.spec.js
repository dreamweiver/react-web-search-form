import {formatSearchQuery, extractSearchResults, getAutoSuggestions, getWikiResults, getDuckDuckGoResults} from './helpers';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

let mockAdap = undefined;

const wikiMockData = {
					batchcomplete: "",
					continue: {
						sroffset: 10,
						continue: "-||"
					},
					query: {
						searchinfo: {
							totalhits: 36916
						},
						search: [{
								ns: 0,
								title: "Maserati",
								pageid: 63971,
								size: 65938,
								wordcount: 6179,
								snippet: "<span class=\"searchmatch\">Maserati</span> (Italian pronunciation: [mazerati]) is an Italian luxury vehicle manufacturer established on 1 December 1914, in Bologna. The <span class=\"searchmatch\">Maserati</span> tagline",
								timestamp: "2018-02-08T15:27:25Z"
							},
							{
								ns: 0,
								title: "Maserati Quattroporte",
								pageid: 1245350,
								size: 65084,
								wordcount: 5672,
								snippet: "The <span class=\"searchmatch\">Maserati</span> Quattroporte (Italian pronunciation: [ˌkwattroˈpɔrte]) is a four-door luxury sports sedan produced by Italian car manufacturer <span class=\"searchmatch\">Maserati</span>. The",
								timestamp: "2018-02-05T03:28:53Z"
							}
						]
					}
				};

const duckDuckGoMockData = {
							Definition: "",
							DefinitionURL: "",
							ImageHeight: 0,
							Heading: "Maserati",
							ImageIsLogo: 0,
							DefinitionSource: "",
							AnswerType: "",
							Type: "D",
							Abstract: "",
							Image: "",
							RelatedTopics: [
								{
									Icon: {
										Height: "",
										URL: "https://duckduckgo.com/i/fd3dee4a.jpg",
										Width: ""
									},
									FirstURL: "https://duckduckgo.com/Maserati",
									Result: "<a href=\"https://duckduckgo.com/Maserati\">Maserati</a> An Italian luxury vehicle manufacturer established on December 1, 1914, in Bologna.",
									Text: "Maserati An Italian luxury vehicle manufacturer established on December 1, 1914, in Bologna."
								},
								{
									Text: "Maserati (band) A band from Athens, Georgia, United States whose sound has been described as a combination of...",
									Result: "<a href=\"https://duckduckgo.com/Maserati_(band)\">Maserati (band)</a>A band from Athens, Georgia, United States whose sound has been described as a combination of...",
									FirstURL: "https://duckduckgo.com/Maserati_(band)",
									Icon: {
										URL: "https://duckduckgo.com/i/a5d99322.jpg",
										Height: "",
										Width: ""
									}
								}
							],
							AbstractText: "",
							ImageWidth: 0,
							Entity: "",
							Results: [ ],
							Answer: "",
							Redirect: "",
							Infobox: "",
							meta: {},
							AbstractURL: "https://en.wikipedia.org/wiki/Maserati_(disambiguation)",
							AbstractSource: "Wikipedia"

							};

const autoSuggestionsMockData = ["maserati",
		["maserati suv",
			"maserati levante",
			"maserati quattroporte",
			"maserati ghibli",
			"maserati price",
			"maserati logo",
			"maserati alfieri",
			"maserati mc12",
			"maserati biturbo",
			"maserati grancabrio",
			"maserati car",
			"maserati ghibli price",
			"maserati preis",
			"maserati boomerang",
			"maserati gt"
		],
	];

describe("Helpers Unit test cases", () => {

it('Format search query: search query(multiple words) with should be formatted succesfully', () => {
	//prepare
	const query = "tony stark";

	//execute
	const actualFormattedQuery = formatSearchQuery(query);
	const expectedFormattedQuery = 'tony+stark';

	//assert
    expect(expectedFormattedQuery).toEqual(actualFormattedQuery);

});

it('Format search query: search query(single word) with should be formatted succesfully', () => {
	//prepare
	const query = "maserati";

	//execute
	const actualFormattedQuery = formatSearchQuery(query);
	const expectedFormattedQuery = 'maserati';

	//assert
    expect(expectedFormattedQuery).toEqual(actualFormattedQuery);

});

beforeEach(() => {
  mockAdap = new MockAdapter(axios);
});

afterEach(() => {
  mockAdap.restore();
});



// verify ajax call to wiki api
it('verify ajax call: getWikiResults ajax call should return a promise', () => {
	//prepare
	const searchQuery = 'maserati'
	const getWikiResultsApiUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&origin=*&utf8=&format=json&srsearch='+searchQuery;


    //construct mock data for  axios ajax call
	//const mockAdap = new MockAdapter(axios);
    
	//stubbing post request with mock data
    mockAdap.onGet(getWikiResultsApiUrl).reply(200, wikiMockData);


	//execute 
	const actualPromise = getWikiResults(searchQuery);
	const expectedPromise = new Promise(function(resolve, reject) {
		//empty function for UT
	});

	//assert
     expect(expectedPromise).toEqual(actualPromise);

     

});

// verify ajax call to wiki api
it('verify ajax call: getDuckDuckGoResults ajax call should return a promise', () => {
	//prepare
	const searchQuery = 'maserati'
	const getDuckDuckGoResultsApiUrl = 'http://api.duckduckgo.com/?q='+ searchQuery +'&format=json&skip_disambig=1&origin=http://localhost:3000';


    //construct mock data for  axios ajax call
	//const mockAdap = new MockAdapter(axios);
    
	//stubbing post request with mock data
    mockAdap.onGet(getDuckDuckGoResultsApiUrl).reply(200, duckDuckGoMockData);


	//execute 
	const actualPromise = getDuckDuckGoResults(searchQuery);
	const expectedPromise = new Promise(function(resolve, reject) {
		//empty function for UT
	});

	//assert
     expect(expectedPromise).toEqual(actualPromise);

     

});


// verify ajax call to wiki api
it('extract results from json: map results from wiki api', () => {
	//prepare
	const searchQuery = 'maserati'
	const getWikiResultsApiUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&origin=*&utf8=&format=json&srsearch='+searchQuery;


    //construct mock data for  axios ajax call
	const mockAdap = new MockAdapter(axios);
    
	//stubbing post request with mock data
    mockAdap.onGet(getWikiResultsApiUrl).reply(200, wikiMockData);


	//execute 
	const actualData = extractSearchResults(wikiMockData, 'wiki');
	const expectedData = wikiMockData.query.search;

	//assert
    expect(actualData.length).toEqual(expectedData.length);
});


// verify ajax call to wiki api
it('extract results from json: map results from duckDuckGo api', () => {
	//prepare
	const searchQuery = 'maserati'
	const getWikiResultsApiUrl = 'http://api.duckduckgo.com/?q='+ searchQuery +'&format=json&skip_disambig=1&origin=http://localhost:3000';


    //construct mock data for  axios ajax call
	const mockAdap = new MockAdapter(axios);
    
	//stubbing post request with mock data
    mockAdap.onGet(getWikiResultsApiUrl).reply(200, duckDuckGoMockData);


	//execute 
	const actualData = extractSearchResults(duckDuckGoMockData, 'duckDuckGo');
	const expectedData = duckDuckGoMockData.RelatedTopics;

	//assert
    expect(actualData.length).toEqual(expectedData.length);
});


// // verify auto suggestions api 
// it('fetch auto suggestions: get auto suggestiond from google api', () => {
// 	//prepare
// 	const searchQuery = 'maserati'
// 	const getAutoSuggestionsApiUrl = "http://suggestqueries.google.com/complete/search?client=chrome&q="+searchQuery;  

// 	let ctx = {
// 			suggestions : [],
// 			setState(state) {
// 				this.suggestions = state.suggestions
// 			}
// 		};

//     //construct mock data for  axios ajax call
// 	const mockAdap = new MockAdapter(axios);
    
// 	//stubbing post request with mock data
//     mockAdap.onGet(getAutoSuggestionsApiUrl).reply(200, autoSuggestionsMockData);

//     console.log("suggestions before:",ctx.suggestions);

// 	//execute 
// 	getAutoSuggestions(searchQuery, ctx);

// 	console.log("suggestions after:",ctx.suggestions);

	
// 	const actualData = ctx.suggestions;
// 	const expectedData = autoSuggestionsMockData[1].slice(0,10);

// 	//assert
//     expect(actualData.length).toEqual(expectedData.length);
// });

});