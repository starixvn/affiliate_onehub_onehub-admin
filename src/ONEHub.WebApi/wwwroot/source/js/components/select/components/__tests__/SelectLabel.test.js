import React from 'react'
import renderer from 'react-test-renderer'

import SelectLabel from '../SelectLabel'

const defaultProps = {
    selectedText: 'ABC',
    isDisable: true
}

describe('SelectLabel ', () => {
    describe('render', () => {
        it('rendered content should match to snap shot', () => {
            const label = renderer.create(<SelectLabel {...defaultProps} />);

            const result = label.toJSON();

            expect(result).toMatchSnapshot();
        })

        it('click on label - props.onToggle should be called', () => {
            const toggleFunc = jest.fn();
            const props = Object.assign({}, defaultProps, { onToggle: toggleFunc });
            const label = renderer.create(<SelectLabel {...props} />);

            const renderedContent = label.toJSON();
            renderedContent.props.onClick();

            expect(toggleFunc).toHaveBeenCalled();
        })
    })
})