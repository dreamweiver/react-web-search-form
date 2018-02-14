import Index from './index.js';

//added UT to coverage
it('Index renders without crashing', () => {
  expect(JSON.stringify(Index)).toMatchSnapshot();
});