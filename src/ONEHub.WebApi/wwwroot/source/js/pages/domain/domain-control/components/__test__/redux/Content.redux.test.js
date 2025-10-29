jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('domain control- Content - connect', () => {
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
            selectedTargetCountry: 'en-US',
            shouldResetScrollPosition: true,
            gridData: [],
            affDomainList: [],
            affSubDomainList: [],
            redirectDomainList: []
        };
        const state = {
            selectedTargetCountry: 'en-US',
            shouldResetScrollPosition: true,
            gridData: [],
            affDomainList: [],
            affSubDomainList: [],
            redirectDomainList: [],
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            deleteDomain: actions['deleteDomain'],
            fetchData: actions['fetchData'],
            fetchDomain: actions['fetchDomain'],
            toggleLoader: actions['toggleLoader'],
            setSelectedDomainId: actions['setSelectedDomainId'],
            setShouldResetScrollPosition: actions['setShouldResetScrollPosition']
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