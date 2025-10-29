import React from 'react';
import { TasksWaitingForApproval } from '../TasksWaitingForApproval';
import { shallow } from 'enzyme';

describe('home - components - TasksWaitingForApproval', () => {
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
        getGeneralInfo: jest.fn()
    }
    it('render correctly', () => {
        const result = shallow(<TasksWaitingForApproval {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });
});