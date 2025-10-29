jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('affiliate report - Filter - connect', () => {
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
            languageList: { en: 'English' },
            productList: { 133: 'New Group' },
            pagingOption: { PageSize: 1 },
            param: { abc: 123 },
            today: '09/24/2019',
            currentViewLevel: 'abc'
        };

        const state = {
            languageList: { en: 'English' },
            productList: { 133: 'New Group' },
            pagingOption: { PageSize: 1 },
            param: { abc: 123 },
            today: '09/24/2019',
            currentViewLevel: 'abc',
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            setCommGroupList: actions['setCommGroupList'],
            setPaymentCurrencyList: actions['setPaymentCurrencyList'],
            setIsCheckedDatePicker: actions['setIsCheckedDatePicker'],
            setProductList: actions['setProductList'],
            setReportTitle: actions['setReportTitle'],
            setParam: actions['setParam'],
            setCurrencyList: actions['setCurrencyList']
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