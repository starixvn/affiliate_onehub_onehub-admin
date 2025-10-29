jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('department list - InsertUpdateForm - connect', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../InsertUpdateForm').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            selectedDepartmentId: 123,
            isOpenInsertUpdatePopup: true
        };
        const state = {
            selectedDepartmentId: 123,
            isOpenInsertUpdatePopup: true,
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            setSelectedDepartmentId: actions['setSelectedDepartmentId'],
            fetchData: actions['fetchData'],
            getDepartmentDetail: actions['getDepartmentDetail'],
            toggleLoader: actions['toggleLoader'],
            insertDepartment: actions['insertDepartment'],
            updateDepartment: actions['updateDepartment'],
            setOpenInsertUpdatePopup: actions['setOpenInsertUpdatePopup']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const InsertUpdateForm = require('../../InsertUpdateForm').InsertUpdateForm;

        expect(connectMock).toHaveBeenCalledWith(InsertUpdateForm);
    })
})