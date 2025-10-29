jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('member list - Content - connect', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../Content').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            param: { AffName: '12BETAFF226' },
            shouldResetScrollPosition: true,
            pagingOption: { PageSize: 1, PageIndex: 20 },
            gridData: []
        };
        const state = {
            param: { AffName: '12BETAFF226' },
            shouldResetScrollPosition: true,
            pagingOption: { PageSize: 1, PageIndex: 20 },
            gridData: [],
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
            setPagingOption: actions['setPagingOption'],
            toggleLoader: actions['toggleLoader'],
            setSelectedMemberId: actions['setSelectedMemberId'],
            setShouldResetScrollPosition: actions['setShouldResetScrollPosition'],
            setParam: actions['setParam']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const Content = require('../../Content').Content;

        expect(connectMock).toHaveBeenCalledWith(Content);
    })
})