jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('adjustment - Content - connect', () => {
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
        const expectedResult = { affInfo: { AffId: 1271808, AffName: '12BETAFF226' } };
        const state = {
            affCommonInfo: { affId: 1271808, affName: '12BETAFF226' },
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            toggleLoaderUserPanel: actions['toggleLoaderUserPanel'],
            getBalanceBroughtForward: actions['getBalanceBroughtForward'],
            handleSubmit: actions['handleSubmit'],
            getAffiliateInfo: actions['getAffiliateInfo']
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