import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';

describe('Adjustment - components - Content', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    const affInfo = {
        AffId: 1271808,
        AffName: "12BETAFF226"
    };
    const data = 980228054;
    const defaultProps = {
        affInfo,
        toggleLoaderUserPanel: jest.fn(),
        getBalanceBroughtForward: jest.fn(() => data)
    }

    it('render correctly with isValidAmount is true', () => {
        const result = shallow(<Content {...defaultProps} />);
        result.setState({ amount: '123456' });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with isValidAmount is false', () => {
        const result = shallow(<Content {...defaultProps} />);
        result.setState({ amount: '123abc', isSuccess: false });

        expect(result).toMatchSnapshot();
    });

    it('componentDidMount - should call getBalanceBroughtForward', () => {
        const wrapper = shallow(<Content {...defaultProps} />);
        const instance = wrapper.instance();
        instance.getBalanceBroughtForward = jest.fn();

        instance.componentDidMount();

        expect(instance.getBalanceBroughtForward).toHaveBeenCalled();
    });

    it('getBalanceBroughtForward - should call toggleLoaderUserPanel, getBalanceBroughtForward and setState', async () => {
        const wrapper = shallow(<Content {...defaultProps} />);
        wrapper.setState = jest.fn();

        await wrapper.instance().getBalanceBroughtForward();

        expect(defaultProps.toggleLoaderUserPanel).toHaveBeenCalledTimes(4);
        expect(defaultProps.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(defaultProps.toggleLoaderUserPanel.mock.calls[1][0]).toBe(true);
        expect(defaultProps.toggleLoaderUserPanel.mock.calls[2][0]).toBe(false);
        expect(defaultProps.toggleLoaderUserPanel.mock.calls[3][0]).toBe(false);
        expect(defaultProps.getBalanceBroughtForward).toHaveBeenCalledWith(affInfo);
        expect(wrapper.setState).toHaveBeenCalledWith({ balanceBf: data });
    });

    it('handleChangeAmount - should call setState with correct amount', async () => {
        const event = {
            target: {
                name: 'amount',
                value: '123456'
            }
        }
        const wrapper = shallow(<Content {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="text"][name="amount"][id="amount"]').simulate('change', event);

        expect(wrapper.setState).toHaveBeenCalledWith({ amount: '123,456' });
    });

    it('handleChangeAmount - should call setState with correct amount but not format', async () => {
        const event = {
            target: {
                name: 'amount',
                value: '123.456'
            }
        }
        const wrapper = shallow(<Content {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="text"][name="amount"][id="amount"]').simulate('change', event);

        expect(wrapper.setState).toHaveBeenCalledWith({ amount: '123.456' });
    });

    it('handleChangeAmount - should call setState with incorrect amount', async () => {
        const event = {
            target: {
                name: 'amount',
                value: 'abc'
            }
        }
        const wrapper = shallow(<Content {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="text"][name="amount"][id="amount"]').simulate('change', event);

        expect(wrapper.setState).not.toHaveBeenCalled();
    });

    it('handleChange - should call setState when change description textarea ', async () => {
        const event = {
            target: {
                name: 'description',
                value: 'abc'
            }
        }
        const wrapper = shallow(<Content {...defaultProps} />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="textarea"][name="description"][id="description"]').simulate('change', event);

        expect(wrapper.setState).toHaveBeenCalledWith({ description: 'abc' });
    });

    it('handlePressEnter - should call handleSubmit when press Enter', () => {
        const event = { charCode: 13, preventDefault: jest.fn() };
        const wrapper = shallow(<Content {...defaultProps} />);
        const instance = wrapper.instance();
        instance.handleSubmit = jest.fn();

        wrapper.find('Input[type="text"][name="amount"][id="amount"]').simulate('keyPress', event);

        expect(instance.handleSubmit).toHaveBeenCalled();
    });

    it('handlePressEnter - should not call handleSubmit when press other keyboards', () => {
        const event = { charCode: 123 };
        const wrapper = shallow(<Content {...defaultProps} />);
        const instance = wrapper.instance();
        instance.handleSubmit = jest.fn();

        wrapper.find('Input[type="text"][name="amount"][id="amount"]').simulate('keyPress', event);

        expect(instance.handleSubmit).not.toHaveBeenCalled();
    });

    it('handleSubmit - should call toggleLoaderUserPanel and setState with amount is required', async () => {
        const wrapper = shallow(<Content {...defaultProps} />);
        wrapper.setState = jest.fn((obj, fn) => fn && fn());

        await wrapper.find('Button').simulate('click');

        expect(defaultProps.toggleLoaderUserPanel).toHaveBeenCalledTimes(4);
        expect(defaultProps.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(defaultProps.toggleLoaderUserPanel.mock.calls[1][0]).toBe(true);
        expect(defaultProps.toggleLoaderUserPanel.mock.calls[2][0]).toBe(false);
        expect(defaultProps.toggleLoaderUserPanel.mock.calls[3][0]).toBe(false);

        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: "The amount is required" }, expect.any(Function)]);
    });

    it('handleSubmit - should call toggleLoaderUserPanel and setState with amount is invalid', async () => {
        const wrapper = shallow(<Content {...defaultProps} />);
        wrapper.setState({ amount: '0' });
        wrapper.setState = jest.fn((obj, fn) => fn && fn());

        await wrapper.find('Button').simulate('click');

        expect(defaultProps.toggleLoaderUserPanel).toHaveBeenCalledTimes(4);
        expect(defaultProps.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(defaultProps.toggleLoaderUserPanel.mock.calls[1][0]).toBe(true);
        expect(defaultProps.toggleLoaderUserPanel.mock.calls[2][0]).toBe(false);
        expect(defaultProps.toggleLoaderUserPanel.mock.calls[3][0]).toBe(false);

        expect(wrapper.setState.mock.calls[0]).toEqual([{ isShowMessage: true, isSuccess: false, message: "The amount is invalid" }, expect.any(Function)]);
        expect(wrapper.setState.mock.calls[1][0]).toEqual({ "balanceBf": 980228054 });
    });

    it('handleSubmit - should call toggleLoaderUserPanel and _validateAmount and handleSubmit with correct amount', async () => {
        const result = { IsSuccessful: false, Message: 'Adjustment is failed!' }
        const handleSubmit = jest.fn(() => result);
        const props = Object.assign({}, defaultProps, { handleSubmit });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState({ amount: '100' });
        wrapper.setState = jest.fn((obj, fn) => fn && fn());

        await wrapper.find('Button').simulate('click');

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(4);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[2][0]).toBe(false);
        expect(props.toggleLoaderUserPanel.mock.calls[3][0]).toBe(false);

        expect(props.handleSubmit).toHaveBeenCalledWith({ AffId: 1271808, Amount: 100, Description: '' });
        expect(wrapper.setState.mock.calls[1]).toEqual([{ amount: "100", description: "", isShowMessage: true, isSuccess: false, message: "Adjustment is failed!" }, expect.any(Function)]);
    });

    it('handleSubmit - should call toggleLoaderUserPanel and _validateAmount, handleSubmit and getAffiliateInfo with correct amount', async () => {
        const result = { IsSuccessful: true, Message: '' }
        const handleSubmit = jest.fn(() => result);
        const getAffiliateInfo = jest.fn();
        const props = Object.assign({}, defaultProps, { handleSubmit, getAffiliateInfo });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState({ amount: '100' });
        wrapper.setState = jest.fn((obj, fn) => fn && fn());

        await wrapper.find('Button').simulate('click');

        expect(props.toggleLoaderUserPanel).toHaveBeenCalledTimes(5);
        expect(props.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[1][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[2][0]).toBe(false);
        expect(props.toggleLoaderUserPanel.mock.calls[3][0]).toBe(true);
        expect(props.toggleLoaderUserPanel.mock.calls[4][0]).toBe(false);

        expect(props.handleSubmit).toHaveBeenCalledWith({ AffId: 1271808, Amount: 100, Description: '' });
        expect(wrapper.setState.mock.calls[1]).toEqual([{ amount: "", description: "", isShowMessage: true, isSuccess: true, message: "Updated successfully!" }, expect.any(Function)]);
    });
});