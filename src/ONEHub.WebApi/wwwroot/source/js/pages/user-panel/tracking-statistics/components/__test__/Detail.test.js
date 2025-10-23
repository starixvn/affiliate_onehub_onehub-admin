import React from 'react';
import { Detail } from '../Detail';
import { shallow } from 'enzyme';

describe('tracking statistics - components - Detail', () => {
    const gridData = [
        { TotalClick: 12, UniqueClick: 10, MonthText: "January-2017", DateText: "01/31/2017" },
        { TotalClick: 11, UniqueClick: 9, MonthText: "January-2017", DateText: "01/30/2017" },
        { TotalClick: 10, UniqueClick: 9, MonthText: "January-2017", DateText: "01/29/2017" }
    ];
    const defaultProps = {
        affId: 1271808,
        selectedMonth: "January-2017",
        param: { trackingCode: "" },
        toggleLoaderUserPanel: jest.fn(),
        fetchDetailData: jest.fn(() => gridData)
    }

    it('render correctly', () => {
        const result = shallow(<Detail {...defaultProps} />);

        result.setState({ gridData });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have data is empty', () => {
        const result = shallow(<Detail {...defaultProps} />);

        result.setState({ gridData: [] });

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call fetchData if param change', () => {
        const props = Object.assign({}, defaultProps, { selectedMonth: 'December-2019' });
        const wrapper = shallow(<Detail {...props} />);
        const instance = wrapper.instance();
        instance.fetchData = jest.fn();

        instance.componentDidUpdate(defaultProps);

        expect(instance.fetchData).toHaveBeenCalledWith({ trackingCode: "", selectedMonth: "December-2019" });
    });

    it('fetchData - should call toggleLoaderUserPanel, setState and setPagingOption', async () => {
        const wrapper = shallow(<Detail {...defaultProps} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance.fetchData(defaultProps.param);

        expect(defaultProps.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(defaultProps.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(defaultProps.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(defaultProps.fetchDetailData).toHaveBeenCalledWith({ ...defaultProps.param, affId: 1271808 });
        expect(instance.setState).toHaveBeenCalledWith({ gridData });
    });
});