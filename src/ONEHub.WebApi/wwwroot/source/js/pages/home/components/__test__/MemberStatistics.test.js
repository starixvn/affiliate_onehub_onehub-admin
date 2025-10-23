import React from 'react';
import { MemberStatistics } from '../MemberStatistics';
import { shallow } from 'enzyme';

describe('home - components - MemberStatistics', () => {
    const defaultProps = {
        generalInfo: {
            AffInProMonthNum: 0,
            AffInProAllNum: 3113,
            BonusMonth: 0,
            BonusAll: 509.1923,
            DepositMonth: 0,
            DepositAll: 5830693.0114,
            DepositMemMonthNum: 2516,
            DepositMemAllNum: 8847,
            NetWinlostMonth: -76.9964,
            NetWinlostAll: 1776017.4515,
            PSPFeeMonth: 0,
            PSPFeeAll: -57.124,
            GgrMonth: 58.3306,
            GgrAll: -3453885.1957,
            ApprovedMonthNum: 0,
            ApprovedAllNum: 236,
            BannerNum: 32,
            DisapprovedMonthNum: 0,
            DisapprovedAllNum: 1016,
            PaymentReqNum: 1,
            PendingMonthNum: 0,
            PendingAllNum: 1024
        },
        isUpToNow: true,
    }

    it('render correctly', () => {
        const result = shallow(<MemberStatistics {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with this month', () => {
        const props = Object.assign({}, defaultProps, { isUpToNow: false });
        const result = shallow(<MemberStatistics {...props} />);

        expect(result).toMatchSnapshot();
    });
});