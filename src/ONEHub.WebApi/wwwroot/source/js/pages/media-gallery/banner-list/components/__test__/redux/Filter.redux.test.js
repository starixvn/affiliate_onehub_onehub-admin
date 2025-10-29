jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('banner list - Filter - connect', () => {
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
            categoryList: [{ 123: 'Bonus' }],
            isDisableCurrency: true,
            languageList: [{ LanguageCode: 'en-US', LanguageName: 'English' }],
            currencyList: [{ 234: 'EURO' }],
            sizeList: [{ Id: 123, Name: '300x250' }],
            affTypeList: [{ AffTypeId: 2, AfTypeName: 'Asia' }],
            paramFromHome: { IsFromHome: true },
            pagingOption: { PageSize: 1, PageIndex: 20 }
        };
        const state = {
            categoryList: [{ 123: 'Bonus' }],
            isDisableCurrency: true,
            languageList: [{ LanguageCode: 'en-US', LanguageName: 'English' }],
            currencyList: [{ 234: 'EURO' }],
            sizeList: [{ Id: 123, Name: '300x250' }],
            affTypeList: [{ AffTypeId: 2, AfTypeName: 'Asia' }],
            paramFromHome: { IsFromHome: true },
            pagingOption: { PageSize: 1, PageIndex: 20 },
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
            setParamFromHome: actions['setParamFromHome'],
            getCategoryList: actions['getCategoryList'],
            setDisableCurrency: actions['setDisableCurrency'],
            getSizeList: actions['getSizeList']
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