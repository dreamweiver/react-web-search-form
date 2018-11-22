import React from 'react';
import ReactDOM from 'react-dom';
import {shallow} from 'enzyme';
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {AutoSuggest} from './AutoSuggest';

Enzyme.configure({ adapter: new Adapter() });

  let ctx = {
  	state : {
  		suggestions: ["maserati suv",
			"maserati levante",
			"maserati quattroporte"]
  	},
  	updateSearch() {
  		//dummy definition for UT
  	}
  };

 describe("Auto Suggest Unit test cases", () => {

	it('Auto Suggest component renders without crashing', () => {
	  const div = document.createElement('div');

	  ReactDOM.render(<AutoSuggest suggestions = {ctx.state.suggestions} onSelection = {ctx.updateSearch.bind(ctx)} />, div);
	  ReactDOM.unmountComponentAtNode(div);
	});

	it('handle LoadResults call', () => {
	   let wrapper = shallow(<AutoSuggest suggestions = {ctx.state.suggestions} onSelection = {ctx.updateSearch.bind(ctx)} />);
	   let onSelectionHandler = () => {
	   		//dummy function for UT
	   };

	   wrapper.find('div').at(1).simulate('click');

	});

});
