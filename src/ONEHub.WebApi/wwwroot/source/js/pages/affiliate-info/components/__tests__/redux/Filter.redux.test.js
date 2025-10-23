jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('affiliate info - Filter - connect', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../Filter').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            languageList: { en: 'English' },
            commGroupList: { 133: 'New Group' },
            param: { abc: 123 },
            groupId: 123,
            columnList: [1, 2, 3]
        };

        const state = {
            languageList: { en: 'English' },
            commGroupList: { 133: 'New Group' },
            param: { abc: 123 },
            groupId: 123,
            columnList: [1, 2, 3],
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            setCommGroupList: actions['setCommGroupList'],
            setReportTitle: actions['setReportTitle'],
            setParam: actions['setParam'],
            setParentAffName: actions['setParentAffName'],
            setSelectedColumn: actions['setSelectedColumn']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const Filter = require('../../Filter').Filter;

        expect(connectMock).toHaveBeenCalledWith(Filter);
    })
})