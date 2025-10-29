import React from 'react';
import { UserPanel } from '../UserPanel';
import { shallow, mount } from 'enzyme';

describe('customer - user-panel - components - UserPanel', () => {
    const defaultProps = {
        selectedUserPanel: 'statementHistory',
        isShowLoader: true,
        onClickMenu: jest.fn(),
        claimsPrincipal: { hasClaim: jest.fn(() => true) },
        isPending: false
    }

    it('Should render correctly with is pending', () => {
        const wrapper = shallow(<UserPanel {...defaultProps} />);

        expect(wrapper).toMatchSnapshot();
    });

    it('Should render correctly with not pending', () => {
        const props = Object.assign({}, defaultProps, { isPending: true });
        const wrapper = shallow(<UserPanel {...props} />);

        expect(wrapper).toMatchSnapshot();
    });

    it('useEffect - should call onClickMenu', () => {
        const props = Object.assign({}, defaultProps, { isPending: true });
        mount(<UserPanel {...props} />);

        expect(props.onClickMenu).toHaveBeenCalledWith('edit');
    });
})