import React from 'react';
import ReactDOM from 'react-dom';
import SearchResult from './SearchResult';

it('Search Results component renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SearchResult />, div);
  ReactDOM.unmountComponentAtNode(div);
});
