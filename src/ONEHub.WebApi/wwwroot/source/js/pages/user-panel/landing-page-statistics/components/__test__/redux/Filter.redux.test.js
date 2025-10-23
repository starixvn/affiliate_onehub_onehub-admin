jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('langing page statistics - Filter - connect', () => {
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
            today: '09/252019',
            languageList: { 'en-US': 'English' },
            affId: 1271808
        };
        const state = {
            today: '09/252019',
            languageList: { 'en-US': 'English' },
            affCommonInfo: {
                affId: 1271808
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
            setParam: actions['setParam'],
            setSelectedPage: actions['setSelectedPage'],
            setShortCodeLanguageList: actions['setShortCodeLanguageList'],
            getPageList: actions['getPageList']
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