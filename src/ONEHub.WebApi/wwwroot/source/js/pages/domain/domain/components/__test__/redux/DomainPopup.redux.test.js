jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('domain - DomainPopup - connect', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../DomainPopup').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            selectedDomainId: 123,
            isAffDomain: true
        };
        const state = {
            selectedDomainId: 123,
            isAffDomain: true,
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
            getDomainById: actions['getDomainById'],
            getTargetCountryListByDomain: actions['getTargetCountryListByDomain'],
            setSelectedDomainId: actions['setSelectedDomainId']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const DomainPopup = require('../../DomainPopup').DomainPopup;

        expect(connectMock).toHaveBeenCalledWith(DomainPopup);
    })
})