import React from 'react';
import { AppContainer } from '../AppContainer';
import { shallow } from 'enzyme';
import PaymentRequestUpdateForm from '../../../../common/components/PaymentRequestUpdateForm';

describe('statement history - components - AppContainer', () => {
    const defaultProps = {
        affName: "12BETAFF226",
        transactionId: 1262276211,
        param: {
            fromDate: "1/11/2019",
            isGetAll: false,
            toDate: "7/11/2019"
        }
    }

    it('render correctly with transactionId is null', () => {
        const props = Object.assign({}, defaultProps, { transactionId: null });
        const result = shallow(<AppContainer {...props} />);

        expect(result).toMatchSnapshot()
    });

    it('render correctly with transactionId is not null', () => {
        const result = shallow(<AppContainer {...defaultProps} />);

        expect(result).toMatchSnapshot()
    });

    it('handleClosePopup - should call setTransactionId when call handleClosePopup in PaymentRequestUpdateForm', () => {
        const setTransactionId = jest.fn();
        const props = Object.assign({}, defaultProps, { setTransactionId });

        const wrapper = shallow(<AppContainer {...props} />);
        wrapper.handleClosePopup = jest.fn();

        wrapper.find(PaymentRequestUpdateForm).props().handleClosePopup();

        expect(props.setTransactionId).toHaveBeenCalledWith(null);
    });

    it('handleFetchData - should call setParam and getAffiliateInfo when call handleFetchData in PaymentRequestUpdateForm', () => {
        const props = Object.assign({}, defaultProps, { getAffiliateInfo: jest.fn() });

        const wrapper = shallow(<AppContainer {...props} />);

        wrapper.find(PaymentRequestUpdateForm).props().handleFetchData();

        expect(props.getAffiliateInfo).toHaveBeenCalledWith(defaultProps.affName);
    })
});