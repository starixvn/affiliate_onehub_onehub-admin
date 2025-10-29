import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import Select from '../Select'

const defaultOption = { code: "SB", name: "Sportsbook" };

const defaultProps = {
    dataSource: [defaultOption],
    keyField: "code",
    valueField: "name",
    selectedKey: 'SB',
    onChange: jest.fn(),
    hasInputOption: true,
    isDisable: false
}

describe('Select ', () => {
    describe('Initial State', () => {
        it('has id prop - id value should be correct', () => {
            let defaultId = 1;

            const testIdProp = (idValue) => {
                const currentId = idValue || defaultId++;
                const expectedResult = `select-${currentId}`;
                const select = renderer.create(<Select id={idValue} {...defaultProps} />);
                const instance = select.getInstance();

                const result = instance.id;

                expect(result).toBe(expectedResult);
            }

            const idValues = ["SelectId", undefined, undefined, 100];

            idValues.forEach(testIdProp);
        })

        it('showOptionList should be false', () => {
            const select = new Select(defaultProps);

            const result = select.state.showOptionList;

            expect(result).toBeFalsy();
        })

        it('dataSource prop should convert correctly', () => {
            const expectedResult = [
                { code: defaultOption.code, name: defaultOption.name }
            ]

            const newProp = {
                dataSource: [defaultOption],
                keyField: "code",
                valueField: "name"
            }

            const props = Object.assign({}, defaultProps, newProp);
            const select = new Select(props);

            const result = select.props.dataSource;

            expect(result).toEqual(expectedResult);
        })
    })

    describe('onChangeHandler', () => {
        let select;

        const sportsbookOption = { key: "SB", value: "Sportsbook" };

        beforeEach(() => {
            select = new Select(defaultProps);

            select._callBackToParent = jest.fn();
            select.setState = jest.fn();

            select.onChangeHandler(sportsbookOption);
        })

        it('setState should be called with correct parameter', () => {
            expect(select.setState).toHaveBeenCalledWith({ selectedItem: sportsbookOption });
        })

        it('_callBackToParent should be called with correct parameter', () => {
            expect(select._callBackToParent).toHaveBeenCalledWith("SB");
        })
    })

    describe('onToggle', () => {
        it('new State should be correct', () => {
            let callback;
            const select = new Select(defaultProps);
            select.setState = jest.fn((cb) => callback = cb);

            select.onToggle();

            let result = callback({ showOptionList: false });
            expect(result).toEqual({ inputOption: "", showOptionList: true });

            result = callback({ showOptionList: true });
            expect(result).toEqual({ inputOption: "", showOptionList: false });
        })
    })

    describe('_handleChangeInput', () => {
        it('new State should be correct', () => {
            const select = new Select(defaultProps);
            select.setState = jest.fn();

            select._handleChangeInput({ target: { name: 'inputOption', value: 'ABC' }});

            expect(select.setState).toHaveBeenCalledWith({ inputOption: 'ABC' });
        })
    })

    describe('_callBackToParent', () => {
        it('call onChange function in props with correct parameters', () => {
            const expectedSelectedItemKey = "SB";
            const select = new Select(defaultProps);

            select.props.onChange = jest.fn();

            select._callBackToParent(expectedSelectedItemKey);

            expect(select.props.onChange).toHaveBeenCalledWith(expectedSelectedItemKey);
        })
    })

    describe('close', () => {
        it('setState function should be called with correct parameter', () => {
            const props = Object.assign({}, defaultProps, { selectedKey: "ABC" });
            const expectedParam = { showOptionList: false, inputOption: '' };

            const componentInstance = new Select(props);
            componentInstance.setState = jest.fn();

            componentInstance._close();

            expect(componentInstance.setState).toHaveBeenCalledWith(expectedParam);
        })
    })

    describe('_handleDocumentClick', () => {
        it('wrapper element is null - do nothing', () => {
            const instance = new Select(defaultProps);
            instance._close = jest.fn();

            const clickEvent = new Event('click');
            document.dispatchEvent(clickEvent);

            expect(instance._close).not.toHaveBeenCalled();
        })

        it('showOptionList is false - do nothing', () => {
            const component = mount(<Select {...defaultProps} />);
            const instance = component.instance();

            instance._close = jest.fn();

            const clickEvent = new Event('click');
            document.dispatchEvent(clickEvent);

            expect(instance._close).not.toHaveBeenCalled();
        })

        it('showOptionList is true - call _close function', () => {
            const component = mount(<Select {...defaultProps} />);
            component.setState({ showOptionList: true });
            const instance = component.instance();

            instance._close = jest.fn();

            const clickEvent = new Event('click');
            document.dispatchEvent(clickEvent);

            expect(instance._close).toHaveBeenCalled();
        })
    })

    describe('render', () => {
        it('showOptionList = false - render component with "display: none" for dropdown list', () => {
            const component = renderer.create(<Select {...defaultProps} />);

            const tree = component.toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('showOptionList = true - render component with "display: block" for dropdown list', () => {
            const component = renderer.create(<Select {...defaultProps} />);
            const instance = component.getInstance();
            instance.setState({ showOptionList: true });

            const tree = component.toJSON();

            expect(tree).toMatchSnapshot();
        })
    })

    describe('componentWillUnmount', () => {
        it('document.removeEventListener function should be called with correct event name', () => {
            const originalRemoveEventListenerFunction = document.removeEventListener;
            const componentInstance = new Select(defaultProps);
            document.removeEventListener = jest.fn();

            componentInstance.componentWillUnmount();

            expect(document.removeEventListener.mock.calls[0][0]).toBe('click');

            document.removeEventListener = originalRemoveEventListenerFunction;
        })
    })
})