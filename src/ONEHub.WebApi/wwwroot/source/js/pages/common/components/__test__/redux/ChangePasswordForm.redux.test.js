jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/changePassword';

describe('common - ChangePasswordForm - connect', () => {
    let mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../ChangePasswordForm').default;
    });

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            updateChangeAdminPasswword: actions['updateChangeAdminPasswword'],
            updateChangeAffPasswword: actions['updateChangeAffPasswword']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const ChangePasswordForm = require('../../ChangePasswordForm').ChangePasswordForm;

        expect(connectMock).toHaveBeenCalledWith(ChangePasswordForm);
    })
})