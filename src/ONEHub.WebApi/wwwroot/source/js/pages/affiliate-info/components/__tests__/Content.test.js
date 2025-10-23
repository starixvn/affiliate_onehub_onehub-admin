import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';

import * as ajaxRequest from '../../../../modules/ajaxRequest';
import ReportExcel from '../../libs/reportExcel';
jest.mock('../../libs/reportExcel');

describe('affiliate info - Content ', () => {
    const targetCountryList = {
        'MY': 'Malaysia',
        'TH': 'Thailand',
        'CN': 'China'
    };

    const mockColumnList = [
        { columnKey: "Index", columnName: "#", checked: true },
        { columnKey: "Status", columnName: "Status", checked: true },
        { columnKey: "FirstName", columnName: "First Name", checked: true },
        { columnKey: "LastName", columnName: "Last Name", checked: true },
        { columnKey: "Language", columnName: "Language", checked: true },
        { columnKey: "TargetCountryCode", columnName: "Target Country", checked: true },
        { columnKey: "Phone", columnName: "Mobile Phone", checked: true },
        { columnKey: "Email", columnName: "Email", checked: true },
        { columnKey: "RegistrationDateText", columnName: "Registration Date", checked: true },
        { columnKey: "ApprovalDateText", columnName: "Approval Date", checked: true },
        { columnKey: "CommissionGroup", columnName: "Revenue Group", checked: true },
        { columnKey: "BalanceBf", columnName: "Balance B/F", checked: true },
        { columnKey: "Currency", columnName: "Aff. Currency", checked: true },
        { columnKey: "PlayerUserName", columnName: "Aff. Player", checked: true },
        { columnKey: "PlayerCurrency", columnName: "Aff. Player Currency", checked: true },
        { columnKey: "Member", columnName: "Member", checked: true }
    ];
    const selectedColumnList = {
        Index: true,
        Status: true,
        FirstName: true,
        LastName: true,
        Language: true,
        TargetCountryCode: true,
        Phone: true,
        Email: true,
        RegistrationDateText: true,
        ApprovalDateText: true,
        CommissionGroup: true,
        BalanceBf: true,
        Currency: true,
        PlayerUserName: true,
        PlayerCurrency: true,
        Member: true
    };
    const defaultProps = {
        columnList: mockColumnList,
        targetCountryList,
        reportTitle: '',
        param: {},
        languageList: {}
    }

    it('shouldComponentUpdate - return correct value if report title no change ', () => {
        const componentInstance = new Content(defaultProps);

        const result = componentInstance.shouldComponentUpdate({ reportTitle: 'New Title' });

        expect(result).toBeTruthy();
    });

    it('should render correctly with _buildReportTitle', () => {
        const componentInstance = new Content(defaultProps);
        const title = componentInstance._buildReportTitle('Report Title');

        const result = shallow((<div>{title}</div>));

        expect(result).toMatchSnapshot();
    });

    it('should call handleExportExcel when clicking export excel button', () => {
        const componentInstance = new Content(defaultProps);
        componentInstance.handleExportExcel = jest.fn();

        const title = componentInstance._buildReportTitle('Report Title');
        const renderedTitle = shallow(<div>{title}</div>);

        renderedTitle.find('button').simulate('click');

        expect(componentInstance.handleExportExcel).toHaveBeenCalled();
    });

    describe('handleExportExcel ', () => {
        beforeEach(() => {
            // Clear all instances and calls to constructor and all methods:
            ReportExcel.mockClear();
        });

        it('should call toggleLoader, post and ReportExcel when exporting excel', async () => {
            const expectedResponse = { data: ['data 1', 'data 2'], status: 200 };
            ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

            const expectedUrl = 'Portal/Affiliate/GetAffiliateList';
            const expectedParam = {
                AffCode: 927841,
                IsExportExcel: true
            }
            const reportTitle = '', languageList = {};
            const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), param: { AffCode: 927841 } });
            const componentInstance = new Content(props);

            await componentInstance.handleExportExcel();

            expect(props.toggleLoader).toHaveBeenCalledTimes(2);
            expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
            expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();

            expect(ajaxRequest.post).toHaveBeenCalledWith(expectedUrl, expectedParam);
            expect(ReportExcel).toHaveBeenCalledWith(expectedResponse.data, reportTitle, targetCountryList, languageList, selectedColumnList);
        });

        it('should call toggleLoader twice, post but not call ReportExcel when exporting excel with response incorrect', async () => {
            const expectedResponse = { data: ['data 1', 'data 2'], status: 500 };
            ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

            const expectedUrl = 'Portal/Affiliate/GetAffiliateList';
            const expectedParam = {
                AffCode: 927841,
                IsExportExcel: true
            }
            const reportTitle = '', languageList = {};
            const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), param: { AffCode: 927841 } });
            const componentInstance = new Content(props);

            await componentInstance.handleExportExcel();

            expect(props.toggleLoader).toHaveBeenCalledTimes(2);
            expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
            expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();

            expect(ajaxRequest.post).toHaveBeenCalledWith(expectedUrl, expectedParam);
            expect(ReportExcel).not.toHaveBeenCalledWith(expectedResponse.data, reportTitle, targetCountryList, languageList, selectedColumnList);
        });

        it('should call toggleLoader twice, ReportExcel but not call post when exporting excel with affId incorrect', async () => {
            const expectData = { MainData: {}, TotalItem: 0 };
            const expectedUrl = 'Portal/Affiliate/GetAffiliateList';
            const expectedParam = {
                AffCode: "AFF001",
                IsExportExcel: true
            }
            const reportTitle = '', languageList = {};
            const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), param: { AffCode: "AFF001" } });
            const componentInstance = new Content(props);

            await componentInstance.handleExportExcel();

            expect(props.toggleLoader).toHaveBeenCalledTimes(2);
            expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
            expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();

            expect(ajaxRequest.post).not.toHaveBeenCalledWith(expectedUrl, expectedParam);
            expect(ReportExcel).toHaveBeenCalledWith(expectData, reportTitle, targetCountryList, languageList, selectedColumnList);
        });
    });

    it('should render correctly', () => {
        const props = Object.assign({}, defaultProps, { reportTitle: 'Report Title' });
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });
});