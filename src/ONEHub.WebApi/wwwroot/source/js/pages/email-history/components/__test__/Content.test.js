import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';
import { defaultPagingOption } from '../../../../modules/constants';

describe('email history - components - Content ', () => {
    const defaultProps = {
        pagingOption: defaultPagingOption,
        param: {
            FromDate: "6/28/2019",
            IsGetAll: true,
            PageIndex: 1,
            PageSize: 20,
            SearchById: 1,
            SearchText: "123abc123abc",
            ToDate: "6/28/2019"
        },
        checkedEmails: {},
        isModifiable: true,
        isShowSender: true,
        shouldResetScrollPosition: true,
        gridData: null
    }

    const gridData = [
        {
            AffName: "12BETAFF12885",
            Content: null,
            Email: "te@te1.com",
            EmailId: 2255,
            Sender: "test test1",
            SentDateText: "12/14/2018 03:11:25",
            Subject: "Captcha Test 10"
        },
        {
            AffName: "12BETAFF226",
            Content: null,
            Email: "maia.le4@starixsoft.com",
            EmailId: 2205,
            Sender: "12BETAFF226 12BETAFF226",
            SentDateText: "10/07/2018 23:14:09",
            Subject: "dhgd"
        }
    ]

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have gridData', () => {
        const props = Object.assign({}, defaultProps, { gridData });
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have gridData but can not modify', () => {
        const props = Object.assign({}, defaultProps, { gridData, isModifiable: false });
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have gridData is empty', () => {
        const props = Object.assign({}, defaultProps, { gridData: [] });
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with have gridData is empty but not show Sender ', () => {
        const props = Object.assign({}, defaultProps, { gridData: [], isShowSender: false });
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call fetchData if param change', () => {
        const fetchData = jest.fn();
        const param = Object.assign({}, defaultProps.param, { SearchById: 0 });
        const props = Object.assign({}, defaultProps, { param, fetchData });
        const componentInstance = new Content(props);
        componentInstance.componentDidUpdate(defaultProps);

        expect(props.fetchData).toHaveBeenCalledWith({ ...param, PageIndex: 1, PageSize: 20 });
    });

    it('componentDidUpdate - should call fetchData if param not change', () => {
        const fetchData = jest.fn();
        const props = Object.assign({}, defaultProps, { fetchData });
        const componentInstance = new Content(defaultProps);
        componentInstance.componentDidUpdate(defaultProps);

        expect(props.fetchData).not.toHaveBeenCalled();
    });

    it('setSelectedEmailId - should be called when click subject Button', () => {
        const props = Object.assign({}, defaultProps, { setSelectedEmailId: jest.fn() });
        const wrapper = shallow(<Content {...props} />);

        const dataRow = shallow(<div>{wrapper.instance()._renderDataSection(gridData)}</div>);

        dataRow.find('Button').at(0).simulate('click');

        expect(props.setSelectedEmailId).toHaveBeenCalledWith(2255);
    });

    it('onCheckItem - should be called when click checkbox', () => {
        const event = {
            target: {
                checked: true
            }
        };
        const wrapper = shallow(<Content {...defaultProps} />);
        const instance = wrapper.instance();

        instance.onCheckItem = jest.fn((isChecked, emailId) => {});

        const dataRow = shallow(<div>{instance._renderDataSection(gridData)}</div>);

        dataRow.find('input[type="checkbox"]').at(0).simulate('change', event);

        expect(instance.onCheckItem).toHaveBeenCalledWith(true, 2255);
    });

    it('onCheckItem - should call setShouldResetScrollPosition and setCheckedEmails', () => {
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn(), setCheckedEmails: jest.fn() });
        const wrapper = shallow(<Content {...props} />);

        wrapper.instance().onCheckItem(true, 2255);

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(props.setCheckedEmails).toHaveBeenCalledWith({ 2255: true });
    });

    it('handlePaging - should call fetchData with correct parameters', () => {
        const setPagingOption = jest.fn();
        const setParam = jest.fn();
        const PageIndex = 2;
        const PageSize = 50;
        const paramExpect = Object.assign({}, defaultProps.param, { PageIndex, PageSize });

        const props = Object.assign({}, defaultProps, { setPagingOption, setParam });
        const componentInstance = new Content(props);
        componentInstance.fetchData = jest.fn();

        componentInstance.handlePaging(PageIndex, PageSize);

        expect(props.setParam).toHaveBeenCalledWith(paramExpect);
    });
});