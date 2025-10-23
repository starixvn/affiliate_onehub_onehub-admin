import React from 'react';
import { Content } from '../Content';
import { shallow } from 'enzyme';

import ReportExcel from '../../libs/reportExcel';
jest.mock('../../libs/reportExcel');

describe('affiliate report - Content ', () => {
    const mainView = 1;
    const monthOnMonth = 2;

    const defaultProps = {
        reportTitle: '',
        currentViewLevel: mainView,
        fetchData: jest.fn(),
        param: {}
    };

    it('shouldComponentUpdate - return correct value if report title no change', () => {
        const componentInstance = new Content(defaultProps);

        const result = componentInstance.shouldComponentUpdate({ reportTitle: 'New Title' });

        expect(result).toBeTruthy();
    });

    it('handleClickBreadcrumb - should call setViewLevel', () => {
        const mockSetViewLevel = jest.fn();
        const props = Object.assign({}, defaultProps, { setViewLevel: mockSetViewLevel });
        const componentInstance = new Content(props);
        componentInstance.gridDataRef = {
            current: { _resetScroll: jest.fn() }
        }

        componentInstance.handleClickBreadcrumb();

        expect(props.setViewLevel).toHaveBeenCalledWith(mainView);
    });

    it('should render correctly with _buildReportTitle when currentViewLevel is Main view', () => {
        const componentInstance = new Content(defaultProps);
        const title = componentInstance._buildReportTitle('Report Title - currentViewLevel is Main view');

        const result = shallow(<div>{title}</div>);

        expect(result).toMatchSnapshot();
    });

    it('should call handleExportExcel when clicking export excel button and currentViewLevel is Main view', () => {
        const componentInstance = new Content(defaultProps);
        componentInstance.handleExportExcel = jest.fn();

        const title = componentInstance._buildReportTitle('Report Title - currentViewLevel is Main view');
        const renderedTitle = shallow(<div>{title}</div>);

        renderedTitle.find('button').simulate('click');

        expect(componentInstance.handleExportExcel).toHaveBeenCalled();
    });

    it('should render correctly with _buildReportTitle when currentViewLevel is Month on Month view', () => {
        const props = Object.assign({}, defaultProps, { currentViewLevel: monthOnMonth });
        const componentInstance = new Content(props);
        const title = componentInstance._buildReportTitle();

        const result = shallow(<div>{title}</div>);

        expect(result).toMatchSnapshot();
    });

    it('should call handleExportExcel when clicking export excel button and currentViewLevel is Month on Month view', () => {
        const props = Object.assign({}, defaultProps, { currentViewLevel: monthOnMonth });
        const componentInstance = new Content(props);
        componentInstance.handleExportExcel = jest.fn();

        const title = componentInstance._buildReportTitle();
        const renderedTitle = shallow(<div>{title}</div>);

        renderedTitle.find('button').simulate('click');

        expect(componentInstance.handleExportExcel).toHaveBeenCalled();
    });


    describe('handleExportExcel', () => {
        beforeEach(() => {
            // Clear all instances and calls to constructor and all methods:
            ReportExcel.mockClear();
        });

        it('should pass request param correctly when exporting excel with currentViewLevel is Main view', () => {
            const expectedParam = {
                userName: 'Main view',
                IsExportExcel: true
            };

            const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), param: { userName: 'Main view' } });
            const componentInstance = new Content(props);

            componentInstance.handleExportExcel();

            expect(props.fetchData).toHaveBeenCalledWith(expectedParam, true);
        });

        it('should pass request param correctly when exporting excel with currentViewLevel is Month on Month view', () => {
            const expectedParam = {
                userName: 'Month on Month view',
                IsExportExcel: true
            }

            const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), param: { userName: 'Month on Month view' }, currentViewLevel: monthOnMonth });
            const componentInstance = new Content(props);

            componentInstance.handleExportExcel();

            expect(defaultProps.fetchData).toHaveBeenCalledWith(expectedParam, false);
        });

        it('should call toggleLoader twice with correct parameters', async () => {
            const mockToggleLoader = jest.fn();
            const props = Object.assign({}, defaultProps, { toggleLoader: mockToggleLoader, param: { userName: 'AFF001' }, fetchData: jest.fn() });
            const componentInstance = new Content(props);

            await componentInstance.handleExportExcel();

            expect(props.toggleLoader).toHaveBeenCalledTimes(2);
            expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
            expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();
        });

        it('should create new instance of ReportExcel with correct parameter', async () => {
            const expectedData = ['data 1', 'data 2'];

            const reportTitle = 'report title', isMainView = true;
            const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), reportTitle: reportTitle, fetchData: jest.fn(() => expectedData) });
            const componentInstance = new Content(props);

            await componentInstance.handleExportExcel();

            expect(ReportExcel).toHaveBeenCalled();
        });
    });

    it('should render correctly when currentViewLevel is Main view', () => {
        const props = Object.assign({}, defaultProps, { reportTitle: 'Report Title - currentViewLevel is Main view' });
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('12BET - should render correctly when currentViewLevel is Main view', () => {
        const props = Object.assign({}, defaultProps, { reportTitle: 'Report Title - currentViewLevel is Main view' });
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('should render correctly when currentViewLevel is Month on Month view', () => {
        const props = Object.assign({}, defaultProps, { reportTitle: 'Report Title - currentViewLevel is Month on Month view', currentViewLevel: monthOnMonth });
        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    });
});