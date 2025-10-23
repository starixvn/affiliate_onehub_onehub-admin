import React from 'react'
import renderer from 'react-test-renderer'

import MultipleSelectLabel from '../MultipleSelectLabel'

const NO_SELECTED_LABEL = "Select options";
const MAX_SELECTED_ITEM_FOR_DISPLAY = 3;

const defaultSelectedItem = {
    key: "keyDefault",
    value: "valueDefault"
};
const defaultProps = {
    selectedItems: [],
    isSelectedAll: false,
    noneSelectedLabel: NO_SELECTED_LABEL,
    maxDisplayItemCount: MAX_SELECTED_ITEM_FOR_DISPLAY
}

describe('MultipleSelectLabel ', () => {
    describe('render', () => {
        it('rendered content should match to snap shot', () => {
            const label = renderer.create(<MultipleSelectLabel {...defaultProps} />);

            const result = label.toJSON();

            expect(result).toMatchSnapshot();
        })

        it('click on label - props.onToggle should be called', () => {
            const toggleFunc = jest.fn();
            const selectedItems = [defaultSelectedItem, { key: "key1", value: "value1" }];
            const props = Object.assign({}, defaultProps, { onToggle: toggleFunc, selectedItems });
            const label = renderer.create(<MultipleSelectLabel {...props} />);

            const renderedContent = label.toJSON();
            renderedContent.props.onClick();

            expect(toggleFunc).toHaveBeenCalled();
        })
    })
})