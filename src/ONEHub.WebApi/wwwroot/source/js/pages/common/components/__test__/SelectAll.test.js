import React from 'react';
import SelectAll from '../SelectAll';
import { shallow } from 'enzyme';

describe('common - components - SelectAll ', () => {
    const defaultProps = {
        checkedList: { 2205: false, 2255: true }
    }

    it('render correctly', () => {
        const result = shallow(<SelectAll {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('onCheckAll - should be called when click All button', () => {
        const setShouldResetScrollPosition = jest.fn();
        const setCheckedList = jest.fn();
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition, setCheckedList });
        const result = shallow(<SelectAll {...props} />);

        result.find('Button').at(0).simulate('click', true);

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(props.setCheckedList).toHaveBeenCalledWith({ 2205: true, 2255: true });
    });

    it('onCheckAll - should be called when click None button', () => {
        const setShouldResetScrollPosition = jest.fn();
        const setCheckedList = jest.fn();
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition, setCheckedList });
        const result = shallow(<SelectAll {...props} />);

        result.find('Button').at(1).simulate('click', false);

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(props.setCheckedList).toHaveBeenCalledWith({ 2205: false, 2255: false });
    });
})