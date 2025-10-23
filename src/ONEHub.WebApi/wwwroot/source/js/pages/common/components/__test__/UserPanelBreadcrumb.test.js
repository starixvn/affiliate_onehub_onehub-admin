import React from 'react';
import UserPanelBreadcrumb from '../UserPanelBreadcrumb';
import { shallow } from 'enzyme';

describe('common - components - UserPanelBreadcrumb', () => {
    it('render correctly', () => {
        const breadcrumbList = [
            { handleClick: jest.fn(), title: 'Daily Earning' },
            { handleClick: jest.fn(), title: 'Daily Earning Detail' }
        ];

        const result = shallow(<UserPanelBreadcrumb breadcrumbList={breadcrumbList} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with breadcrumbList is null', () => {
        const result = shallow(<UserPanelBreadcrumb />);

        expect(result).toMatchSnapshot();
    });
});