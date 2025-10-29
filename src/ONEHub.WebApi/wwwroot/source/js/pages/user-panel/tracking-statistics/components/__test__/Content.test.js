import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';

describe('tracking statistics - components - Content', () => {
    const gridData = [
        { TotalClick: 0, UniqueClick: 0, MonthText: "December-2019", Date: "12/01/2019" },
        { TotalClick: 487, UniqueClick: 342, MonthText: "January-2017", Date: "01/01/2017" },
        { TotalClick: 414, UniqueClick: 291, MonthText: "December-2016", Date: "12/01/2016" }
    ];
    const defaultProps = {
        affId: 1271808,
        param: { trackingCode: "" },
        setSelectedMonth: jest.fn(),
        toggleLoaderUserPanel: jest.fn(),
        fetchData: jest.fn(() => gridData)
    }

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);

        result.setState({ gridData });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have data is empty', () => {
        const result = shallow(<Content {...defaultProps} />);

        result.setState({ gridData: [] });

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call fetchData if param change', () => {
        const param = Object.assign({}, defaultProps.param, { trackingCode: '[None]' });
        const props = Object.assign({}, defaultProps, { param });
        const wrapper = shallow(<Content {...props} />);
        const instance = wrapper.instance();
        instance.fetchData = jest.fn();

        instance.componentDidUpdate(defaultProps);

        expect(instance.fetchData).toHaveBeenCalledWith(param);
    });

    it('fetchData - should call toggleLoaderUserPanel, setState and setPagingOption', async () => {
        const wrapper = shallow(<Content {...defaultProps} />);
        const instance = wrapper.instance();
        instance.setState = jest.fn();

        await instance.fetchData(defaultProps.param);

        expect(defaultProps.toggleLoaderUserPanel).toHaveBeenCalledTimes(2);
        expect(defaultProps.toggleLoaderUserPanel.mock.calls[0][0]).toBe(true);
        expect(defaultProps.toggleLoaderUserPanel.mock.calls[1][0]).toBe(false);

        expect(defaultProps.fetchData).toHaveBeenCalledWith({ ...defaultProps.param, affId: 1271808 });
        expect(instance.setState).toHaveBeenCalledWith({ gridData });
    });

    it('setSelectedMonth - should be called when click button', async () => {
        const wrapper = shallow(<Content {...defaultProps} />);
        wrapper.setState = jest.fn();

        const dataRow = shallow(<div>{wrapper.instance()._buildDataRow(gridData[1], 2)}</div>);

        dataRow.find('Button').simulate('click');

        expect(defaultProps.setSelectedMonth).toHaveBeenCalledWith("01/01/2017");
    });
});