import {mapSearchResults, getWebResults, getAutoSuggestions} from './helpers';
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

	beforeEach(() => {
	  mockAdap = new MockAdapter(axios);
	});

	afterEach(() => {
	  mockAdap.restore();
	});


	// verify ajax Auto suggestions
	it('Get Auto Suggestions from google api', () => {
		//prepare
		const searchQuery = 'maserati'
		const autoSuggestUrl = "http://suggestqueries.google.com/complete/search?client=chrome&q="+searchQuery; 
		const autoSuggestionsLimit = 10;

	    //construct mock data for  axios ajax call
		const mockAdap = new MockAdapter(axios);
	    
		//stubbing post request with mock data
	    mockAdap.onGet(autoSuggestUrl).reply(200, autoSuggestionsMockData);

		//execute 
		const actualPromise = getAutoSuggestions(searchQuery, autoSuggestionsLimit);
		const expectedPromise = new Promise(function(resolve, reject) {
									//empty function for UT
								});
		let actualAutoSuggestions;
		let expectedAutoSuggestions = autoSuggestionsMockData[1].slice(0, autoSuggestionsLimit);

		//assert
		expect(actualPromise).toEqual(expectedPromise);
		return expect(actualPromise).resolves.toEqual(expect.arrayContaining(expectedAutoSuggestions));
	});


	// verify extract web results  from wiki and duckduckgo api
	it('Get Web Search results from wiki & duckDuckGo api', () => {
		//prepare
		const searchQuery = 'maserati'
		const getWikiResultsApiUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&origin=*&utf8=&format=json&srsearch='+ searchQuery;
		const getDuckDuckGoResultsApiUrl = 'http://api.duckduckgo.com/?q='+ searchQuery +'&format=json&skip_disambig=1&origin=http://localhost:3000';

	    //construct mock data for  axios ajax call
		const mockAdap = new MockAdapter(axios);
	    
		//stubbing post request with mock data
	    mockAdap.onGet(getWikiResultsApiUrl).reply(200, wikiMockData);
	    mockAdap.onGet(getDuckDuckGoResultsApiUrl).reply(200, duckDuckGoMockData);

		//execute 
		const actualPromise = getWebResults(searchQuery);
		const expectedPromise = new Promise(function(resolve, reject) {
									//empty function for UT
								});
		let actualWebResults;
		let expectedWebResults = mapSearchResults(wikiMockData, duckDuckGoMockData);

		//assert
		expect(actualPromise).toEqual(expectedPromise);
		return expect(actualPromise).resolves.toEqual(expect.arrayContaining(expectedWebResults));
	});
});