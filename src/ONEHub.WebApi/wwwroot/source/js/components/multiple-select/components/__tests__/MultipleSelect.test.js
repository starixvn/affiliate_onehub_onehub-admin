import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import MultipleSelect from '../MultipleSelect'


const defaultProps = {
    dataSource: [{ key: "SB", value: "Sportsbook", checked: false }],
    keyField: "key",
    valueField: "value",
    statusField: "checked",
    noneSelectedLabel: "Select Options",
    optionAllLabel: "All",
    maxDisplayItemCount: 1,
    onChange: jest.fn(),
    hasAllOption: true,
    hasInputOption: true
}

const defaultOption = { code: "SB", name: "Sportsbook", status: true };
const defaultDataSource = [defaultOption];

describe('MultipleSelect ', () => {
    describe('Initial State', () => {
        it('has id prop - id value should be correct', () => {
            let defaultId = 1;

            const testIdProp = (idValue) => {
                const currentId = idValue || defaultId++;
                const expectedResult = `multiple-select-${currentId}`;
                const multipleSelect = renderer.create(<MultipleSelect id={idValue} {...defaultProps} />);
                const instance = multipleSelect.getInstance();

                const result = instance.id;

                expect(result).toBe(expectedResult);
            }

            const idValues = ["multipleSelectId", undefined, undefined, 100];

            idValues.forEach(testIdProp);
        })

        it('showOptionList should be false', () => {
            const multipleSelect = new MultipleSelect(defaultProps);

            const result = multipleSelect.state.showOptionList;

            expect(result).toBeFalsy();
        })

        it('dataSource prop should convert correctly', () => {
            const expectedResult = [
                { code: defaultOption.code, name: defaultOption.name, status: defaultOption.status }
            ]

            const newProp = {
                dataSource: defaultDataSource,
                keyField: "code",
                valueField: "name",
                statusField: "status"
            }

            const props = Object.assign({}, defaultProps, newProp);
            const multipleSelect = new MultipleSelect(props);

            const result = multipleSelect.props.dataSource;

            expect(result).toEqual(expectedResult);
        })
    })

    describe('onChangeHandler', () => {
        let multipleSelect;

        const sportsbookOption = { key: "SB", value: "Sportsbook", checked: true };
        const changedItem = { key: "BA", value: "BA", checked: true };

        const dataSource = [sportsbookOption, Object.assign({}, changedItem, { checked: false })];
        const newDataSource = [sportsbookOption, changedItem];

        beforeEach(() => {
            const props = Object.assign({}, defaultProps, { dataSource });
            multipleSelect = new MultipleSelect(props);

            multipleSelect._callBackToParent = jest.fn();
            multipleSelect.setState = jest.fn();

            multipleSelect.onChangeHandler(changedItem);
        })

        it('_callBackToParent should be called with correct parameter', () => {
            expect(multipleSelect._callBackToParent).toHaveBeenCalledWith(changedItem, newDataSource);
        })
    })

    describe('onToggle', () => {
        it('new State should be correct', () => {
            let callback;
            const multipleSelect = new MultipleSelect(defaultProps);
            multipleSelect.setState = jest.fn((cb) => callback = cb);

            multipleSelect.onToggle();

            let result = callback({ showOptionList: false });
            expect(result).toEqual({ inputOption: "", showOptionList: true });

            result = callback({ showOptionList: true });
            expect(result).toEqual({ inputOption: "", showOptionList: false });
        })
    })

    describe('checkAllHandler', () => {
        let multipleSelect;
        const sportsbookOption = { key: "SB", value: "Sportsbook", checked: true };
        const baOption = { key: "BA", value: "BA", checked: true };

        const testCheckAll = (checked) => {
            const dataSource = [
                Object.assign({}, sportsbookOption, { checked: !checked }),
                Object.assign({}, baOption, { checked: !checked })
            ];

            const props = Object.assign({}, defaultProps, { dataSource });
            multipleSelect = new MultipleSelect(props);

            multipleSelect._callBackToParent = jest.fn();
            multipleSelect.setState = jest.fn();

            multipleSelect.checkAllHandler(checked);
        }

        it('_callBackToParent should be called with correct parameter', () => {
            const checked = true;
            const newDataSource = [
                Object.assign({}, sportsbookOption, { checked }),
                Object.assign({}, baOption, { checked })
            ];

            testCheckAll(checked);

            expect(multipleSelect._callBackToParent).toHaveBeenCalledWith(null, newDataSource);
        })
    })

    describe('_handleChangeInput', () => {
        it('new State should be correct', () => {
            const multipleSelect = new MultipleSelect(defaultProps);
            multipleSelect.setState = jest.fn();

            multipleSelect._handleChangeInput({ target: { name: 'inputOption', value: 'ABC' }});

            expect(multipleSelect.setState).toHaveBeenCalledWith({ inputOption: 'ABC' });
        })
    })

    describe('_callBackToParent', () => {
        it('call onChange function in props with correct parameters', () => {
            const expectedSelectedItemKey = "SB,BA";
            const expectedSelectedItem = { key: "Key", value: "Value", checked: true };
            const multipleSelect = new MultipleSelect(defaultProps);

            multipleSelect._getSelectedItemKey = jest.fn().mockReturnValueOnce(expectedSelectedItemKey);
            multipleSelect.props.onChange = jest.fn();

            const dataSource = [];
            multipleSelect._callBackToParent(expectedSelectedItem, dataSource);

            expect(multipleSelect.props.onChange).toHaveBeenCalledWith(expectedSelectedItem, expectedSelectedItemKey);
        })
    })

    describe('_getSelectedItemKey', () => {
        it('get correct key of items that checked', () => {
            const expectedResult = "SB,BA";
            const dataSource = [
                { key: "SB", value: "Value SB", checked: true },
                { key: "BA", value: "Value BA", checked: true },
                { key: "RC", value: "Value RC", checked: false }
            ]

            const componentInstance = new MultipleSelect(defaultProps);

            const result = componentInstance._getSelectedItemKey(dataSource);

            expect(result).toBe(expectedResult);
        })
    })

    describe('close', () => {
        it('setState function should be called with correct parameter', () => {
            const expectedParam = { showOptionList: false, inputOption: '' };

            const componentInstance = new MultipleSelect(defaultProps);
            componentInstance.setState = jest.fn();

            componentInstance._close();

            expect(componentInstance.setState).toHaveBeenCalledWith(expectedParam);
        })
    })

    describe('_handleDocumentClick', () => {
        it('wrapper element is null - do nothing', () => {
            const instance = new MultipleSelect(defaultProps);
            instance._close = jest.fn();

            const clickEvent = new Event('click');
            document.dispatchEvent(clickEvent);

            expect(instance._close).not.toHaveBeenCalled();
        })

        it('showOptionList is false - do nothing', () => {
            const component = mount(<MultipleSelect {...defaultProps} />);
            const instance = component.instance();

            instance._close = jest.fn();

            const clickEvent = new Event('click');
            document.dispatchEvent(clickEvent);

            expect(instance._close).not.toHaveBeenCalled();
        })

        it('showOptionList is true - call _close function', () => {
            const component = mount(<MultipleSelect {...defaultProps} />);
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
            const component = renderer.create(<MultipleSelect {...defaultProps} />);

            const tree = component.toJSON();

            expect(tree).toMatchSnapshot();
        })

        it('showOptionList = true - render component with "display: block" for dropdown list', () => {
            const dataSource = [
                { key: "SB", value: "Value SB", checked: true },
                { key: "BA", value: "Value BA", checked: true },
                { key: "RC", value: "Value RC", checked: true }
            ];

            const props = Object.assign({}, defaultProps, { dataSource });

            const component = renderer.create(<MultipleSelect {...props} />);
            const instance = component.getInstance();
            instance.setState({ showOptionList: true });

            const tree = component.toJSON();

            expect(tree).toMatchSnapshot();
        })
    })

    describe('componentWillUnmount', () => {
        it('document.removeEventListener function should be called with correct event name', () => {
            const originalRemoveEventListenerFunction = document.removeEventListener;
            const componentInstance = new MultipleSelect(defaultProps);
            document.removeEventListener = jest.fn();

            componentInstance.componentWillUnmount();

            expect(document.removeEventListener.mock.calls[0][0]).toBe('click');

            document.removeEventListener = originalRemoveEventListenerFunction;
        })
    })
})