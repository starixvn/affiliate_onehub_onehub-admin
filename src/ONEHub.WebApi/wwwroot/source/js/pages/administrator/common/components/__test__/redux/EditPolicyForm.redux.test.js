jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('administrator - common components - EditPolicyForm - connect', () => {
    let mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../EditPolicyForm').default;
    });

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            getRolePolicy: actions['getRolePolicy'],
            getAccountPolicyList: actions['getAccountPolicyList'],
            getPolicyListByAccountIds: actions['getPolicyListByAccountIds'],
            updateAccountPolicy: actions['updateAccountPolicy'],
            updateRolePolicy: actions['updateRolePolicy']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const EditPolicyForm = require('../../EditPolicyForm').EditPolicyForm;

        expect(connectMock).toHaveBeenCalledWith(EditPolicyForm);
    })
})