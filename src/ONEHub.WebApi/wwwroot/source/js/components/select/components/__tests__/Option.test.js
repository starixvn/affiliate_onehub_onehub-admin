import React from 'react';
import { shallow } from 'enzyme';

import Option from '../Option';

const defaultProps = {
    itemData: {
        key: "key",
        value: "value"
    },
    id: "itemId",
    onChange: jest.fn()
}

describe('Option ', () => {
    describe('onChange', () => {
        const event = {
            stopPropagation: jest.fn()
        }

        it('event.stopPropagation should be called', () => {
            const wrapper = shallow(<Option {...defaultProps} />);

            wrapper.find('li').simulate('click', event);

            expect(event.stopPropagation).toHaveBeenCalled();
        })

        it('props.onChange should be called with corect parameter', () => {
            const { key, value } = defaultProps.itemData;
            const expectedItemData = { key, value };

            const wrapper = shallow(<Option {...defaultProps} />);

            wrapper.find('li').simulate('click', event);

            expect(defaultProps.onChange).toHaveBeenCalledWith(expectedItemData);
        })
    })

    it('render - content match with snapshot', () => {
        const option = shallow(<Option {...defaultProps} />);

        expect(option).toMatchSnapshot();
    })
})

