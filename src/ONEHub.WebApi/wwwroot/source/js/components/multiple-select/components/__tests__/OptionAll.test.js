import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import OptionAll from '../OptionAll';
import Option from '../Option';

const LABEL = "All";
const DEFAULT_CHECKED = false;

const defaultProps = {
    onChange: undefined,
    id: "optionAll",
    label: LABEL,
    checked: DEFAULT_CHECKED
}

describe('OptionAll ', () => {
    it('changeHandler - props.onChange function should be called with correct parameter', () => {
        const onChange = jest.fn();
        const props = Object.assign({}, defaultProps, { onChange });

        const checkedItem = {
            key: "key",
            value: "value",
            checked: false
        };

        const wrapper = shallow(<OptionAll {...props} />);

        wrapper.find(Option).simulate('change', checkedItem);

        expect(props.onChange).toHaveBeenCalledWith(checkedItem.checked);
    })

    it('render - content match with snapshot', () => {
        const option = renderer.create(<OptionAll {...defaultProps} />);

        const result = option.toJSON();

        expect(result).toMatchSnapshot();
    })
})