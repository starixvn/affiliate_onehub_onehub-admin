import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';
import MonthPicker from '@9softstudio/react-monthpicker';

describe('customer statistics - components - Content', () => {
    const defaultProps = {
        monthDate: '7/1/2019',
        today: '7/1/2019',
        affId: 1271808
    };

    const data = {
        ActivePlayersByMonth: 0,
        DepositByMonth: 0,
        DepositTotal: 951.435,
        FdmByMonth: 0,
        FdmTotal: 1829,
        SignupsByMonth: 0,
        SignupsTotal: 3742,
        TotalClickByMonth: 0,
        TotalClickMobileByMonth: 0,
        TotalClickPCByMonth: 0,
        TurnoverByMonth: 0,
        TurnoverTotal: 1061706.9773,
        UniqueClickByMonth: 0,
        UniqueClickMobileByMonth: 0,
        UniqueClickPCByMonth: 0,
        GgrByMonth: 0,
        GgrTotal: -42950.0237
    }

    const dataHasPlayerActive = {
        ActivePlayersByMonth: 2,
        DepositByMonth: 0,
        DepositTotal: 951.435,
        FdmByMonth: 0,
        FdmTotal: 1829,
        SignupsByMonth: 0,
        SignupsTotal: 3742,
        TotalClickByMonth: 0,
        TotalClickMobileByMonth: 0,
        TotalClickPCByMonth: 0,
        TurnoverByMonth: 0,
        TurnoverTotal: 1061706.9773,
        UniqueClickByMonth: 0,
        UniqueClickMobileByMonth: 0,
        UniqueClickPCByMonth: 0,
        GgrByMonth: 0,
        GgrTotal: -42950.0237
    }

    it('Should render correctly', () => {
        const setMonthDate = jest.fn();
        const fetchData = jest.fn(() => data);
        const props = Object.assign({}, defaultProps, { setMonthDate, fetchData });
        const wrapper = shallow(<Content {...props} />);

        expect(wrapper).toMatchSnapshot();
    });

    it('Should render correctly with have data', () => {
        const setMonthDate = jest.fn();
        const fetchData = jest.fn(() => data);
        const props = Object.assign({}, defaultProps, { setMonthDate, fetchData });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState({ data });

        expect(wrapper).toMatchSnapshot();
    });

    it('Should render correctly with have data has player active', () => {
        const setMonthDate = jest.fn();
        const fetchData = jest.fn(() => data);
        const props = Object.assign({}, defaultProps, { setMonthDate, fetchData });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState({ data: dataHasPlayerActive });

        expect(wrapper).toMatchSnapshot();
    });

    it('componentDidUpdate - should call fetchData if affId change', () => {
        const setMonthDate = jest.fn();
        const fetchData = jest.fn(() => data);
        const props = Object.assign({}, defaultProps, { setMonthDate, fetchData });
        const componentInstance = new Content(props);
        componentInstance.fetchData = jest.fn();
        componentInstance.componentDidUpdate({ affId: 123456 });

        expect(componentInstance.fetchData).toHaveBeenCalledWith(defaultProps.today);
    });

    it('handleSelectMonth - should call fetchData', async () => {
        const setMonthDate = jest.fn();
        const fetchData = jest.fn(() => data);
        const props = Object.assign({}, defaultProps, { setMonthDate, fetchData });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState({ data });
        await wrapper.find(MonthPicker).simulate('select', 6, 2019);

        expect(props.setMonthDate).toHaveBeenCalledWith("6/1/2019");
    });

    it('handleFormatMonthPicker - should return correct', () => {
        const setMonthDate = jest.fn();
        const fetchData = jest.fn(() => data);
        const props = Object.assign({}, defaultProps, { setMonthDate, fetchData });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState({ data });
        const result = wrapper.find(MonthPicker).props().onFormat(6, 2019);

        expect(result).toEqual('Jun-2019');
    });

    it('fetchData - should call setMonthDate, fetchData and setState', async () => {
        const setMonthDate = jest.fn();
        const fetchData = jest.fn(() => data);

        const props = Object.assign({}, defaultProps, { setMonthDate, fetchData });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState = jest.fn();

        await wrapper.instance().fetchData(defaultProps.monthDate);

        expect(props.setMonthDate).toHaveBeenCalledWith("7/1/2019");
        expect(props.fetchData).toHaveBeenCalledWith({ monthDate: "7/1/2019", affId: 1271808 });
        expect(wrapper.setState).toHaveBeenCalledWith({ data, isLoading: false });
    });

    it('redirectToReferrers - should be called when click at referrers laptop link', () => {
        const setMonthDate = jest.fn();
        const fetchData = jest.fn(() => data);
        const redirectToReferrers = jest.fn()
        const props = Object.assign({}, defaultProps, { setMonthDate, fetchData, redirectToReferrers });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState({ data: dataHasPlayerActive });

        wrapper.find('a').at(0).simulate('click');
        expect(props.redirectToReferrers).toHaveBeenCalledWith({ deviceType: 0, fromDate: "7/1/2019", isClickLink: true, toDate: "7/31/2019" });
    });

    it('redirectToReferrers - should be called when click at referrers mobile link', () => {
        const setMonthDate = jest.fn();
        const fetchData = jest.fn(() => data);
        const redirectToReferrers = jest.fn()
        const props = Object.assign({}, defaultProps, { setMonthDate, fetchData, redirectToReferrers });
        const wrapper = shallow(<Content {...props} />);
        wrapper.setState({ data: dataHasPlayerActive });

        wrapper.find('a').at(1).simulate('click');
        expect(props.redirectToReferrers).toHaveBeenCalledWith({ deviceType: 1, fromDate: "7/1/2019", isClickLink: true, toDate: "7/31/2019" });
    });
})