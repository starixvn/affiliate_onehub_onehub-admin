jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/paymentRequestUpdate';

describe('common - PaymentRequestUpdateForm - connect', () => {
    let mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../PaymentRequestUpdateForm').default;
    });

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            getPaymentRequestDetail: actions['getPaymentRequestDetail'],
            updatePaymentRequest: actions['updatePaymentRequest']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const PaymentRequestUpdateForm = require('../../PaymentRequestUpdateForm').PaymentRequestUpdateForm;

        expect(connectMock).toHaveBeenCalledWith(PaymentRequestUpdateForm);
    })
})