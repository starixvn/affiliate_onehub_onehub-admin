jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('landing page list - InsertUpdateForm - connect', () => {
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
            selectedLandingPageId: 123
        };
        const state = {
            selectedLandingPageId: 123,
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            setSelectedLandingPageId: actions['setSelectedLandingPageId'],
            fetchData: actions['fetchData'],
            getTargetCountryListByLandingPage: actions['getTargetCountryListByLandingPage'],
            getLandingPageDetail: actions['getLandingPageDetail'],
            insertLandingPage: actions['insertLandingPage'],
            updateLandingPage: actions['updateLandingPage'],
            toggleLoader: actions['toggleLoader']
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