import React from 'react';
import { shallow } from 'enzyme';

// import App from '../App';

// TODO test App
describe('Root /', () => {
  test('renders', () => {
    expect(shallow(<div>Test</div>)).toMatchSnapshot();
  });
});
