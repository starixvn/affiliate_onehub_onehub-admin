import React from 'react';
import { UserPanelItem } from '../withUserPanel';
import { shallow } from 'enzyme';

describe('user panel - components - withUserPanel', () => {
    let props, result;
    beforeEach(() => {
        const Test = () => (<h1>Test</h1>)
        props = { PageComponent: Test, name: test, resetUserPanel: jest.fn() }
        result = shallow(<UserPanelItem {...props} />)
    })

    it('render correctly', () => {
        expect(result).toMatchSnapshot();
    });

    it('componentWillUnmount - should call resetUserPanel', () => {
        result.instance().componentWillUnmount()

        expect(props.resetUserPanel).toHaveBeenCalled()
    });
});