jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../../actions/index';

describe('left panel - OnlineInfoPanel - connect', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../OnlineInfoPanel').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            affiliateInfo: { AffId: 1271808 },
            affName: '12BETAFF226'
        };

        const state = {
            leftPanel: { affiliateInfo: { AffId: 1271808 }, affName: '12BETAFF226' },
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            toggleLoaderLeftPanel: actions['toggleLoaderLeftPanel'],
            getOnLineList: actions['getOnLineList']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const OnlineInfoPanel = require('../../OnlineInfoPanel').OnlineInfoPanel;

        expect(connectMock).toHaveBeenCalledWith(OnlineInfoPanel);
    })
})