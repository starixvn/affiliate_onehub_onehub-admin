jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('domain control - DomainControlPopup - connect', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../DomainControlPopup').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            selectedDomainId: 123,
            selectedTargetCountry: 'MY',
            affSubDomainList: [],
            targetCountryList: [],
            affDomainList: [],
            redirectDomainList: []
        };
        const state = {
            selectedDomainId: 123,
            selectedTargetCountry: 'MY',
            affSubDomainList: [],
            targetCountryList: [],
            affDomainList: [],
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
            insertDomain: actions['insertDomain'],
            fetchData: actions['fetchData'],
            updateDomain: actions['updateDomain'],
            toggleLoader: actions['toggleLoader'],
            getDomainControlById: actions['getDomainControlById'],
            getTargetCountryListByDomains: actions['getTargetCountryListByDomains'],
            setSelectedDomainId: actions['setSelectedDomainId']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const DomainControlPopup = require('../../DomainControlPopup').DomainControlPopup;

        expect(connectMock).toHaveBeenCalledWith(DomainControlPopup);
    })
})