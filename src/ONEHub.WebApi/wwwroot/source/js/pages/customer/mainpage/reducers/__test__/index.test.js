﻿import { RESET_USER_PANEL } from '../../../user-panel/actions/types';
import { rootReducer } from '../index';
import { defaultPagingOption } from '../../../../../modules/constants';

describe('customer - mainpage reducer', () => {
    const expectedResult = {
        adjustment: {
            affInfo: {},
        },
        affCommonInfo: null,
        baseCurrencyList: null,
        claimsPrincipal: {},
        clickStatistics: {
            pagingOption: defaultPagingOption,
            param: {},
            selectedSiteUrl: null,
        },
        currencyList: null,
        customerStatistics: {
            monthDate: null,
        },
        dailyEarning: {
            param: null,
        },
        dailyEarningDetail: {
            param: {},
        },
        subAffiliate: {
            pagingOption: defaultPagingOption,
            param: {},
        },
        edit: {
            moreSiteUrlsList: null,
            userAccountInfo: null,
        },
        isProduction: false,
        isShowLoaderUserPanel: false,
        landingPageStatistics: {
            pageList: [],
            selectedPage: null,
            pagingOption: {
                PageIndex: 1,
                PageList: [10, 20, 50, 100, 200, 500],
                PageSize: 20,
                TotalItem: 0
            },
            param: {},
        },
        languageList: null,
        leftPanel: {
            affName: '',
            affiliateInfo: null,
            affTypeList: null,
            isShowLoader: false,
            isValidUserName: true,
        },
        marketingStatistics: {
            pagingOption: defaultPagingOption,
            param: null,
        },
        member: {
            pagingOption: defaultPagingOption,
            param: null,
        },
        note: {
            affNote: {
                isShowPopup: false,
                affNoteInfo: {
                    noteContent: '',
                    noteId: 0,
                },
                affNoteList: null,
                pagingOption: defaultPagingOption,
            },
            marketingNote: {
                isShowPopup: false,
                marketingNoteInfo: {
                    noteContent: '',
                    noteId: 0,
                },
                marketingNoteList: null,
                pagingOption: defaultPagingOption,
            },
            selectedSubNote: null
        },
        playerDetail: {
            pagingOption: defaultPagingOption,
            param: {},
            sortingColumn: {
                ColumnName: "Turnover",
                IsSortAsc: false,
            }
        },
        productList: null,
        selectedUserPanel: null,
        statementHistory: {
            expandMonthDateList: {},
            pagingOption: defaultPagingOption,
            param: null,
            transactionId: null,
        },
        licenseeName: '',
        today: '6/27/2019',
        trackingStatistics: {
            param: {},
            selectedMonth: null,
        },
        viewLog: {
            pagingOption: defaultPagingOption,
            param: {},
            showIdList: {},
        },
    }

    it(`should handle rootReducer reducer`, () => {
        const expectResult = Object.assign({}, expectedResult, { isShowLoaderUserPanel: true, })
        const state = { today: '6/27/2019' };
        const result = rootReducer(state, { type: 'TOGGLE_LOADER_USER_PANEL', data: true });
        expect(result).toEqual(expectResult);
    });

    it(`should handle rootReducer reducer with action.type is RESET_USER_PANEL`, () => {
        const state = { today: '6/27/2019' };
        const result = rootReducer(state, { type: RESET_USER_PANEL, data: 'statementHistory' });
        expect(result).toEqual(expectedResult);
    });
});