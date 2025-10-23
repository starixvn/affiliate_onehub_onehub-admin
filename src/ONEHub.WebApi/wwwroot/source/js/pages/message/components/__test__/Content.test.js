import React from 'react';
import { Content } from '../Content';
import { shallow, mount } from 'enzyme';

import { defaultPagingOption } from '../../../../modules/constants';
import { Table } from '@9softstudio/react-fixed-table-header';

describe('message - components - Content ', () => {
    const gridData = [
        {
            Creator: "sa",
            Important: true,
            Message: "test",
            MessageId: 37,
            PostedDate: "2019-09-13T02:12:43.987",
            PostedDateText: "09/13/2019 02:12:43",
            UpdatedBy: "sa",
            UpdatedDate: "2019-09-16T02:38:23.327",
            UpdatedDateText: "09/16/2019 02:38:23"
        },
        {
            Creator: "pgmDung",
            Important: false,
            Message: "",
            MessageId: 6,
            PostedDate: "2013-02-18T05:58:53.23",
            PostedDateText: "02/18/2013 05:58:53",
            UpdatedBy: "pgmDung",
            UpdatedDate: "2013-02-18T22:39:10.73",
            UpdatedDateText: "02/18/2013 22:39:10"
        }
    ];

    const param = {
        FromDate: "9/20/2019",
        Important: null,
        IsGetAll: true,
        PageIndex: 1,
        PageSize: 20,
        ToDate: "9/20/2019"
    };

    const defaultProps = {
        pagingOption: defaultPagingOption,
        checkedMessages: { 37: false, 6: false },
        shouldResetScrollPosition: true,
        param,
        gridData
    };

    it('render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with gridData is null', () => {
        const props = Object.assign({}, defaultProps, { gridData: null })
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with gridData is empty', () => {
        const props = Object.assign({}, defaultProps, { gridData: [] })
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('_handlePaging - should be called when onPaging in Table', () => {
        const props = Object.assign({}, defaultProps, { setPagingOption: jest.fn(), setParam: jest.fn() })
        const result = shallow(<Content {...props} />);

        result.find(Table).props().onPaging(50, 50);

        expect(props.setPagingOption).toHaveBeenCalledWith({ PageIndex: 50, PageSize: 50 });
        expect(props.setParam).toHaveBeenCalledWith({ FromDate: "9/20/2019", Important: null, IsGetAll: true, PageIndex: 50, PageSize: 50, ToDate: "9/20/2019" });
    });

    it('setSelectedMessageId - should be called when click edit button', () => {
        const props = Object.assign({}, defaultProps, { setSelectedMessageId: jest.fn(), fetchData: jest.fn() })
        const result = mount(<Content {...props} />);

        result.find('Button').at(0).simulate('click');

        expect(props.setSelectedMessageId).toHaveBeenCalledWith(37);
        expect(props.fetchData).toHaveBeenCalledWith({ FromDate: "9/20/2019", Important: null, IsGetAll: true, PageIndex: 1, PageSize: 20, ToDate: "9/20/2019" });
    });

    it('_onCheckItem - should be called when click edit button', () => {
        const event = {
            target: {
                checked: true
            }
        };
        const props = Object.assign({}, defaultProps, { setShouldResetScrollPosition: jest.fn(), setCheckedMessages: jest.fn(), fetchData: jest.fn() })
        const result = mount(<Content {...props} />);

        result.find('input[type="checkbox"]').at(0).simulate('change', event);

        expect(props.setShouldResetScrollPosition).toHaveBeenCalledWith(false);
        expect(props.setCheckedMessages).toHaveBeenCalledWith({ 37: true, 6: false });
        expect(props.fetchData).toHaveBeenCalledWith({ FromDate: "9/20/2019", Important: null, IsGetAll: true, PageIndex: 1, PageSize: 20, ToDate: "9/20/2019" });
    });
})