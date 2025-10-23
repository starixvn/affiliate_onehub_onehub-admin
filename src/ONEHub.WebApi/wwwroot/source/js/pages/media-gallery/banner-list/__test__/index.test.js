import React from 'react'
import { shallow } from 'enzyme'
import App from '../index'

jest.mock('react-dom', () => ({ render: jest.fn() }))

describe('media gallery - banner list - index', () => {

    it('Should render correctly', () => {
        window.initialState = {
            categoryList: [{ "CategoryName": "Sportsbook", "SubCategoryName": "" }, { "CategoryName": "Casino", "SubCategoryName": "" }, { "CategoryName": "Number Game", "SubCategoryName": "" }, { "CategoryName": "Racebook", "SubCategoryName": "" }],
            subCategoryList: [{ "CategoryName": "Sportsbook", "SubCategoryName": "Basketball" }, { "CategoryName": "Sportsbook", "SubCategoryName": "SB Bonus" }, { "CategoryName": "Sportsbook", "SubCategoryName": "Soccer" }, { "CategoryName": "Sportsbook", "SubCategoryName": "Tennis" }, { "CategoryName": "Casino", "SubCategoryName": "Baccarat" }, { "CategoryName": "Casino", "SubCategoryName": "Blackjack" }, { "CategoryName": "Casino", "SubCategoryName": "Casino Bonus" }, { "CategoryName": "Casino", "SubCategoryName": "Roulette" }, { "CategoryName": "Casino", "SubCategoryName": "Sic bo" }, { "CategoryName": "Casino", "SubCategoryName": "Slot" }],
            subCategoryCasinoList: [{ "CategoryName": "Casino", "SubCategoryName": "Baccarat" }, { "CategoryName": "Casino", "SubCategoryName": "Blackjack" }, { "CategoryName": "Casino", "SubCategoryName": "Casino Bonus" }, { "CategoryName": "Casino", "SubCategoryName": "Roulette" }, { "CategoryName": "Casino", "SubCategoryName": "Sic bo" }, { "CategoryName": "Casino", "SubCategoryName": "Slot" }],
            subCategorySportsbookList: [{ "CategoryName": "Sportsbook", "SubCategoryName": "Basketball" }, { "CategoryName": "Sportsbook", "SubCategoryName": "SB Bonus" }, { "CategoryName": "Sportsbook", "SubCategoryName": "Soccer" }, { "CategoryName": "Sportsbook", "SubCategoryName": "Tennis" }],
            languageList: [{ "LanguageCode": "en-GB", "LanguageName": "English (Europe)" }, { "LanguageCode": "en-US", "LanguageName": "English" }, { "LanguageCode": "hi-IN", "LanguageName": "English (India)" }, { "LanguageCode": "id-ID", "LanguageName": "Indonesian" }, { "LanguageCode": "ko-KR", "LanguageName": "Korean" }, { "LanguageCode": "th-TH", "LanguageName": "Thai" }, { "LanguageCode": "vi-VN", "LanguageName": "Vietnamese" }, { "LanguageCode": "zh-CN", "LanguageName": "Chinese Simplified" }, { "LanguageCode": "zh-TW", "LanguageName": "Chinese Traditional" }],
            currencyList: [{ "Id": 3, "Name": "EURO" }, { "Id": 4, "Name": "GBP" }, { "Id": 6, "Name": "IN" }, { "Id": 9, "Name": "INR" }, { "Id": 11, "Name": "KHR" }, { "Id": 10, "Name": "MKK" }, { "Id": 7, "Name": "MYR" }, { "Id": 1, "Name": "RMB" }, { "Id": 5, "Name": "THB" }, { "Id": 2, "Name": "US$" }, { "Id": 8, "Name": "VND" }],
            imageTypeList: [{ "Id": 1, "Name": "Flash" }, { "Id": 2, "Name": "Image" }],
            bannerRootUrl: "https://ha.nexdev.net:7613/12BETBanner",
            sizeList: [{ "Id": 1, "Name": "100x100" }, { "Id": 2, "Name": "140x55" }, { "Id": 3, "Name": "399x399" }, { "Id": 4, "Name": "480x50" }, { "Id": 5, "Name": "721x529" }, { "Id": 6, "Name": "960x1280" }, { "Id": 7, "Name": "1140x386" }, { "Id": 8, "Name": "2339x1421" }, { "Id": 9, "Name": "3040x1342" }],
            affTypeList: [{ "AffTypeId": 2, "AffTypeName": "Asian" }, { "AffTypeId": 3, "AffTypeName": "Media" }, { "AffTypeId": 4, "AffTypeName": "European" }],
            paramFromHome: { "ImageType": null, "IsFromHome": false }
        }

        const wrapper = shallow(<App />);

        expect(wrapper).toMatchSnapshot();
    })
})