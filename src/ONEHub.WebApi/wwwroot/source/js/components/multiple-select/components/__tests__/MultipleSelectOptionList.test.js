import React from 'react';
import renderer from 'react-test-renderer';

import MultipleSelectOptionList from '../MultipleSelectOptionList';

const defaultProps = {
    dataSource: [],
    id: 1
}

describe('MultipleSelectOptionList ', () => {
    it('rendered content should match with snapshot', () => {
        const dataSource = [{
            key: "key1",
            value: "Value 1",
            checked: true
        },
        {
            key: "key2",
            value: "Value 2",
            checked: false
        }
        ];

        const props = Object.assign({}, defaultProps, { dataSource });
        const optionList = renderer.create(<MultipleSelectOptionList {...props} />);

        const result = optionList.toJSON();

        expect(result).toMatchSnapshot();
    })
})