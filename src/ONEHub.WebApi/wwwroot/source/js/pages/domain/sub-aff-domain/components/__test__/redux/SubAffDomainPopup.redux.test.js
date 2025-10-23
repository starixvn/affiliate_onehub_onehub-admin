jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('sub-affiliate domain - SubAffDomainPopup - connect', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../SubAffDomainPopup').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            selectedSubAffDomain: { domainId: 123 }
        };
        const state = {
            selectedSubAffDomain: { domainId: 123 },
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            insertSubAffDomain: actions['insertSubAffDomain'],
            fetchData: actions['fetchData'],
            updateSubAffDomain: actions['updateSubAffDomain'],
            toggleLoader: actions['toggleLoader'],
            setSelectedSubAffDomain: actions['setSelectedSubAffDomain']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const SubAffDomainPopup = require('../../SubAffDomainPopup').SubAffDomainPopup;

        expect(connectMock).toHaveBeenCalledWith(SubAffDomainPopup);
    })
})