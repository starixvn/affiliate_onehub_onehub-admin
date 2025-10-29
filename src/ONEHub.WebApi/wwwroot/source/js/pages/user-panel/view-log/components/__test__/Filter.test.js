import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';
import { DatePicker } from '@9softstudio/react-datepicker';

describe('view log - components - Filter', () => {
    const today = '03/12/2020';
    const logTypeList = [{ TypeId: 1, TypeName: 'RevenueGroup' }];
    const defaultProps = {
        today,
        getLogTypeList: jest.fn()
    };

    it('render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('componentDidMount - should call getLogTypeList', () => {
        const result = new Filter(defaultProps);
        result.getLogTypeList = jest.fn();
        result.componentDidMount();

        expect(result.getLogTypeList).toHaveBeenCalled();
    });

    it('getLogTypeList - should call setState', async () => {
        const props = Object.assign({}, defaultProps, { getLogTypeList: jest.fn(() => "abc") })
        const result = new Filter(props);
        result.setState = jest.fn();
        await result.getLogTypeList();

        expect(result.setState).toHaveBeenCalledWith({ logTypeList: "abc" });
    });

    it('handleChange - should call setState when change Type select', () => {
        const event = {
            target: {
                type: 'select',
                value: 'UserInfo',
                name: 'logType'
            }
        }
        const wrapper = shallow(<Filter {...defaultProps} />);
        wrapper.setState({ logTypeList });
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="select"][name="logType"][id="logType"]').simulate('change', event)

        expect(wrapper.setState).toHaveBeenCalledWith({ logType: 'UserInfo' });
    });

    it('handleChangeFromDate - should be called when From change', () => {
        const monthDate = { format: jest.fn(() => "01/02/2020") };
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.setState = jest.fn();

        wrapper.find(DatePicker).at(0).simulate('change', monthDate);

        expect(wrapper.setState).toHaveBeenCalledWith({ "fromDate": "01/02/2020", "toDate": "3/12/2020" });
    });

    it('handleChangeToDate - should be called when To change', () => {
        const monthDate = { format: jest.fn(() => "3/11/2020") };
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.setState = jest.fn();

        wrapper.find(DatePicker).at(1).simulate('change', monthDate);

        expect(wrapper.setState).toHaveBeenCalledWith({ toDate: "3/11/2020" });
    });

    it('handleSearch - should be called when click Search Button', () => {
        const setParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setParam, setShowIdList: jest.fn() });
        const wrapper = shallow(<Filter {...props} />);
        wrapper.setState({ logTypeList });

        wrapper.find('Button').simulate('click');

        expect(props.setParam).toHaveBeenCalledWith({ "fromDate": "01/01/2020", "logType": 0, "toDate": "3/12/2020", logTypeList });
        expect(props.setShowIdList).toHaveBeenCalledWith({});
    });
});