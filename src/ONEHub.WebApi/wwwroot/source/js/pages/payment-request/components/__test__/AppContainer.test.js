import React from 'react';
import { AppContainer } from '../AppContainer';
import { shallow } from 'enzyme';
import PaymentRequestUpdateForm from '../../../common/components/PaymentRequestUpdateForm';

describe('payment request - components - AppContainer ', () => {
    const defaultProps = {
        isShowLoader: true,
        transactionId: 123,
        param: {
            FromDate: "6/25/2019",
            IsGetAll: false,
            PageIndex: 1,
            PageSize: 20,
            SearchBy: 1,
            Status: null,
            ToDate: "6/26/2019",
            Username: null
        }
    }

    it('render correctly', () => {
        const result = shallow(<AppContainer {...defaultProps} />);

        expect(result).toMatchSnapshot()
    });

    it('setTransactionId - should be called when call handleClosePopup in PaymentRequestUpdateForm', () => {
        const setTransactionId = jest.fn();
        const props = Object.assign({}, defaultProps, { setTransactionId });

        const wrapper = shallow(<AppContainer {...props} />);
        wrapper.handleClosePopup = jest.fn();

        wrapper.find(PaymentRequestUpdateForm).props().handleClosePopup();

        expect(props.setTransactionId).toHaveBeenCalledWith(null);
    });

    it('setParam - should be called when call handleFetchData in PaymentRequestUpdateForm', () => {
        const setParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setParam });

        const wrapper = shallow(<AppContainer {...props} />);

        wrapper.find(PaymentRequestUpdateForm).props().handleFetchData();

        expect(props.setParam).toHaveBeenCalledWith(defaultProps.param);
    })
});