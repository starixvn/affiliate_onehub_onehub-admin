import React from 'react';
import { shallow } from 'enzyme';

import AppLayout from '../AppLayout';

const defaultProps = {
   children: '<h1>App Layout</h1>'
}

describe('AppLayout ', () => {
   it('render - content match with snapshot', () => {
      const appLayout = shallow(<AppLayout {...defaultProps} />);

      expect(appLayout).toMatchSnapshot();
   })
})