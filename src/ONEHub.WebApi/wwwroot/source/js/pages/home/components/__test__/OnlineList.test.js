import React from 'react';
import { OnlineList } from '../OnlineList';
import { shallow } from 'enzyme';

describe('home - components - OnlineList', () => {
    const defaultProps = {
        pagingOption: {
            PageIndex: 1,
            PageSize: 20
        },
        onlineList: [
            {
                Ip: "10.19.10.55",
                LastRequestText: "11/15/2019 04:03:00",
                LoggedInText: "11/14/2019 22:32:00",
                Role: "Admin",
                UserName: "AAHubert"
            },
            {
                Ip: "::1",
                LastRequestText: "11/15/2019 04:04:00",
                LoggedInText: "11/14/2019 23:36:00",
                Role: "Aff",
                UserName: "12BETAFF226"
            }
        ],
        getOnlineList: jest.fn()
    }

    it('render correctly', () => {
        const result = shallow(<OnlineList {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with online list is empty', () => {
        const props = Object.assign({}, defaultProps, { onlineList: [] });
        const result = shallow(<OnlineList {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('_handleFetchData - Should call getOnlineList', async () => {
        const props = Object.assign({}, defaultProps, { getOnlineList: jest.fn() });
        const result = shallow(<OnlineList {...props} />);

        await result.instance()._handleFetchData({ pageIndex: 1, pageSize: 20 });

        expect(props.getOnlineList).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 20 });
    });

    it('handlePaging - Should call _handleFetchData', () => {
        const result = shallow(<OnlineList {...defaultProps} />);
        const instance = result.instance();
        instance._handleFetchData = jest.fn();

        instance.handlePaging(2, 50);

        expect(instance._handleFetchData).toHaveBeenCalledWith({ pageIndex: 2, pageSize: 50 });
    });
});