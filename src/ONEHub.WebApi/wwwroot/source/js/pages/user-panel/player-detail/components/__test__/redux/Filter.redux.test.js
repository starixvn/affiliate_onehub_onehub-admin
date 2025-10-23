jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('player detail - Filter - connect', () => {
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
            param: { abc: 123 },
            affId: 1271808,
            today: '25/09/2019'
        };
        const state = {
            today: '25/09/2019',
            affCommonInfo: {
                affId: 1271808
            },
            playerDetail: {
                param: { abc: 123 },
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
            fetchData: actions['fetchData'],
            getCurrencies: actions['getCurrencies'],
            setSortingColumn: actions['setSortingColumn'],
            getProductList: actions['getProductList']
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