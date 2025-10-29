jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('email history - EmailDetailForm - connect', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../EmailDetailForm').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            selectedEmailId: 234,
            param: { abc: 123 }
        };

        const state = {
            selectedEmailId: 234,
            param: { abc: 123 },
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            fetchData: actions['fetchData'],
            setSelectedEmailId: actions['setSelectedEmailId'],
            getEmailHistoryDetail: actions['getEmailHistoryDetail'],
            toggleLoader: actions['toggleLoader'],
            deleteEmailHistory: actions['deleteEmailHistory']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const EmailDetailForm = require('../../EmailDetailForm').EmailDetailForm;

        expect(connectMock).toHaveBeenCalledWith(EmailDetailForm);
    })
})