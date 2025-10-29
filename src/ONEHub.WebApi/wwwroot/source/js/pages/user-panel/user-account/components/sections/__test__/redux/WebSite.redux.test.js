jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../../actions/index';

describe('user account - WebSite - connect', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../WebSite').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            userAccountInfo: { affId: 1271808 },
            moreSiteUrlsList: { line: 'abc' }
        };
        const state = {
            edit: {
                userAccountInfo: { affId: 1271808 },
                moreSiteUrlsList: { line: 'abc' }
            },
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            setUserAccountInfo: actions['setUserAccountInfo'],
            setMoreSiteUrlsList: actions['setMoreSiteUrlsList']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const WebSite = require('../../WebSite').WebSite;

        expect(connectMock).toHaveBeenCalledWith(WebSite);
    })
})