jest.mock('redux');
jest.mock('react-redux');

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('banner list - EditBannerForm - connect', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../EditBannerForm').default;
    });

    it('props should be mapped correctly', () => {
        const deviceTypeList = [
            {
                key: 0, name: "PC / Laptop", checked: false
            },
            {
                key: 1, name: "Mobile", checked: false
            }
        ];
        const expectedResult = {
            playerCategoryList: [{ Id: 123, Name: 'Slot' }],
            subAffiliateCategoryList: [{ Id: 123, Name: 'SP Bonus' }],
            subCategoryCasinoList: [{ Id: 123, Name: 'Slot' }],
            subCategorySportsbookList: [{ Id: 123, Name: 'SP Bonus' }],
            languageList: [{ LanguageCode: 'en-US', LanguageName: 'English' }],
            currencyList: [{ 234: 'EURO' }],
            subCategoryList: [{ Id: 123, Name: 'Casino' }],
            sizeList: [{ Id: 123, Name: '300x250' }],
            affTypeList: [{ AffTypeId: 2, AfTypeName: 'Asia' }],
            param: { AffType: 2 },
            deviceTypeList,
            selectedBannerId: 2448
        };
        const state = {
            playerCategoryList: [{ Id: 123, Name: 'Slot' }],
            subAffiliateCategoryList: [{ Id: 123, Name: 'SP Bonus' }],
            subCategoryCasinoList: [{ Id: 123, Name: 'Slot' }],
            subCategorySportsbookList: [{ Id: 123, Name: 'SP Bonus' }],
            languageList: [{ LanguageCode: 'en-US', LanguageName: 'English' }],
            currencyList: [{ 234: 'EURO' }],
            subCategoryList: [{ Id: 123, Name: 'Casino' }],
            sizeList: [{ Id: 123, Name: '300x250' }],
            affTypeList: [{ AffTypeId: 2, AfTypeName: 'Asia' }],
            param: { AffType: 2 },
            selectedBannerId: 2448,
            deviceTypeList,
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            setSelectedBannerId: actions['setSelectedBannerId'],
            fetchData: actions['fetchData'],
            getCategoryList: actions['getCategoryList'],
            getBannerDetail: actions['getBannerDetail'],
            getSizeList: actions['getSizeList'],
            insertBanner: actions['insertBanner'],
            updateBanner: actions['updateBanner'],
            toggleLoader: actions['toggleLoader']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const EditBannerForm = require('../../EditBannerForm').EditBannerForm;

        expect(connectMock).toHaveBeenCalledWith(EditBannerForm);
    })
})