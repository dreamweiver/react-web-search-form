import React from 'react';
import ReactDOM from 'react-dom';
import WebSearch from './WebSearch';
import {shallow} from 'enzyme';
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("WebSearch Unit test cases", () => {
	it('WebSearch Compoenent renders without crashing', () => {
	  const div = document.createElement('div');
	  ReactDOM.render(<WebSearch />, div);
	  ReactDOM.unmountComponentAtNode(div);
	});

	it('handle updateSearch call', () => {
	   let wrapper = shallow(<WebSearch />);

	   jest.useFakeTimers(); // to convert all native timer calls with fake callers

	   wrapper.find('input').simulate('change');

	   expect(wrapper.find('.autoSuggest').length).toBe(0);

	   wrapper.find('input').simulate('blur');

	   expect(setTimeout).toHaveBeenCalled();
       expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500); 

	   wrapper.find('button').simulate('click');

	   wrapper.instance().clearAutoSuggestions();

	});

});
