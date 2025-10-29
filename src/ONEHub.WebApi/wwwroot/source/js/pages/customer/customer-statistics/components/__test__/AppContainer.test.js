import React from 'react';
import { AppContainer } from '../AppContainer';
import { shallow } from 'enzyme';

describe('customer statistics - components - AppContainer', () => {
    it('Should render correctly', () => {
        const wrapper = shallow(<AppContainer isShowLoader={true} />);

        expect(wrapper).toMatchSnapshot();
    });
})