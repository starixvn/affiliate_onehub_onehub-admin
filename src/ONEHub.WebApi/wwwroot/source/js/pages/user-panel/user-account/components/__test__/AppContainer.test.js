import React from 'react';
import AppContainer from '../AppContainer';
import { shallow } from 'enzyme';

describe('user account - components - AppContainer', () => {
    it('render correctly', () => {
        const result = shallow(<AppContainer isShowLoader={true} />);

        expect(result).toMatchSnapshot();
    });
});