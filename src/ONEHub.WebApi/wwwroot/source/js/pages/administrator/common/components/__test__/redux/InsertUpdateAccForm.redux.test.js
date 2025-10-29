jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';
import { getDepartmentList } from '../../../../department/actions/index';

describe('administrator - common components - InsertUpdateAccForm - connect', () => {
    let mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../InsertUpdateAccForm').default;
    });

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            getDepartmentList: getDepartmentList,
            getUserDetail: actions['getUserDetail'],
            insertUser: actions['insertUser'],
            insertExistedUser: actions['insertExistedUser'],
            updateUser: actions['updateUser']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const InsertUpdateAccForm = require('../../InsertUpdateAccForm').InsertUpdateAccForm;

        expect(connectMock).toHaveBeenCalledWith(InsertUpdateAccForm);
    })
})