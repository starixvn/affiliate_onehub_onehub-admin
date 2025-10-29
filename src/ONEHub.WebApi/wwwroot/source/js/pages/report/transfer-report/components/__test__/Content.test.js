import React from 'react'
import { shallow } from 'enzyme'
import { Content } from '../Content'
import ReportExcel from '../../libs/reportExcel'
jest.mock('../../libs/reportExcel')

describe('transfer report - component - Content - ', () => {
    const defaultProps = {
        reportTitle: 'Title',
        param: {
            TransId: '',
            AffName: '',
            PlayerName: '',
            FromDate: '10/01/2021',
            ToDate: '10/27/2021',
            BaseCurrencyId: 123,
            PageIndex: 1,
            PageSize: 20
        }
    }

    it('should render correctly', () => {
        const result = shallow(<Content {...defaultProps} />);

        expect(result).toMatchSnapshot();
    })

    it('should render correctly with title is empty', () => {
        const props = { ...defaultProps, reportTitle: '' };

        const result = shallow(<Content {...props} />);

        expect(result).toMatchSnapshot();
    })

    it('shouldComponentUpdate - return correct value if report title no change', () => {
        const componentInstance = new Content(defaultProps);

        const result = componentInstance.shouldComponentUpdate({ reportTitle: 'New Title' });

        expect(result).toBeTruthy();
    });

    describe('handleExportExcel', () => {
        beforeEach(() => {
            ReportExcel.mockClear();
        });

        it('should create new instance of ReportExcel', async () => {
            const expectedData = ['data 1', 'data 2'];

            const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), fetchData: jest.fn(() => expectedData) });
            const componentInstance = new Content(props);

            await componentInstance.handleExportExcel();

            expect(props.toggleLoader).toHaveBeenCalledTimes(2);
            expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
            expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();

            expect(ReportExcel).toHaveBeenCalledWith(expectedData, 'Title');
        });

        it('should not create new instance of ReportExcel', async () => {
            const props = Object.assign({}, defaultProps, { toggleLoader: jest.fn(), fetchData: jest.fn() });
            const componentInstance = new Content(props);

            await componentInstance.handleExportExcel();

            expect(props.toggleLoader).toHaveBeenCalledTimes(2);
            expect(props.toggleLoader.mock.calls[0][0]).toBeTruthy();
            expect(props.toggleLoader.mock.calls[1][0]).toBeFalsy();

            expect(ReportExcel).not.toHaveBeenCalled();
        });
    })
})