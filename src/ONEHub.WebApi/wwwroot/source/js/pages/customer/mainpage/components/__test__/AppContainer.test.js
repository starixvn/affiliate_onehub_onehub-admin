import React from 'react';
import { AppContainer, CustomerStatistics } from '../AppContainer';
import { shallow } from 'enzyme';

describe('customer - mainpage - components - AppContainer', () => {
    const defaultProps = {
        selectedUserPanel: 'statementHistory',
        affId: 1198168,
        status: 'Pending'
    }

    it('Should render correctly with status pending', () => {
        const wrapper = shallow(<AppContainer {...defaultProps} />);

        expect(wrapper).toMatchSnapshot();
    });

    it('Should render correctly with status approved', async () => {
        const props = Object.assign({}, defaultProps, { affId: 1271808, status: 'Approved' })
        const wrapper = shallow(<AppContainer {...props} />);

        await CustomerStatistics;

        expect(wrapper).toMatchSnapshot();
    });
})