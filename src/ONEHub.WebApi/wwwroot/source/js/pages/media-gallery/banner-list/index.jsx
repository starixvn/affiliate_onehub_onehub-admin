import React from 'react';
import { Provider } from 'react-redux';

import AppContainer from './components/AppContainer';

import reducer from './reducers';
import { configureStore } from '../../../modules/store';
import { convertListToMutilpleSelected } from '../../../modules/utils';
import { playerBanner, affiliateBanner } from '../common/libs/constants';
import { convertCatelogyListByUserTypeToMuptileSelected } from './libs/utils';

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);

        const { categoryList, subCategoryList, languageList, currencyList, bannerRootUrl, sizeList, affTypeList,
            paramFromHome, subCategoryCasinoList, subCategorySportsbookList, defaultLanguage } = window.initialState;

        const playerCategoryList = convertCatelogyListByUserTypeToMuptileSelected(categoryList, playerBanner);
        const subAffiliateCategoryList = convertCatelogyListByUserTypeToMuptileSelected(categoryList, affiliateBanner);

        const newSubCategoryList = subCategoryList.map(item => {
            return {
                key: item.SubCategoryName,
                name: item.SubCategoryName,
                parentCategoryName: item.CategoryName,
                checked: true
            };
        });

        const newSizeList = convertListToMutilpleSelected(sizeList, 'Name', 'Name', false);
        const newCurrencyList = convertListToMutilpleSelected(currencyList, 'Name', 'Name', false);
        const newAffTypeList = convertListToMutilpleSelected(affTypeList, 'AffTypeId', 'AffTypeName');

        this.store = configureStore({
            languageList, paramFromHome, categoryList, playerCategoryList, subAffiliateCategoryList, subCategoryList: newSubCategoryList,
            currencyList: newCurrencyList, bannerRootUrl, sizeList: newSizeList, affTypeList: newAffTypeList,
            subCategoryCasinoList, subCategorySportsbookList, defaultLanguage
        }, reducer);
    }

    render() {
        return (
            <Provider store={this.store}>
                <AppContainer />
            </ Provider>
        );
    }
}