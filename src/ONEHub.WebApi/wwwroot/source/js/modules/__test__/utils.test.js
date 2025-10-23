import { handleAfterChangeFromDate, handleAfterChangeToDate } from '../utils';

describe('modules - utils ', () => {

    describe('handleAfterChangeFromDate - ', () => {
        it('should be called when From change', () => {
            const result = handleAfterChangeFromDate({ format: jest.fn(() => "06/06/2022") }, "05/05/2022", 6)

            expect(result).toEqual({ fromDate: "06/06/2022", toDate: "06/06/2022" });
        });

        it('should be called when From < To - rangDate', () => {
            const result = handleAfterChangeFromDate({ format: jest.fn(() => "06/06/2021") }, "05/05/2022", 6)

            expect(result).toEqual({ fromDate: "06/06/2021", toDate: "12/06/2021" });
        });

        it('should be called when From into To - rangDate', () => {
            const result = handleAfterChangeFromDate({ format: jest.fn(() => "03/06/2022") }, "05/05/2022", 6)

            expect(result).toEqual({ fromDate: "03/06/2022", toDate: "05/05/2022" });
        });

        it('should be called when not has maxRangeDate', () => {
            const result = handleAfterChangeFromDate({ format: jest.fn(() => "03/06/2022") }, "12/05/2022")

            expect(result).toEqual({ fromDate: "03/06/2022", toDate: "12/05/2022" });
        });
    });

    describe('handleAfterChangeToDate - ', () => {
        it('should be called when To < From', () => {
            const result = handleAfterChangeToDate({ format: jest.fn(() => "12/12/2020") }, "01/01/2021", 6)

            expect(result).toEqual({ fromDate: "12/12/2020", toDate: "12/12/2020" });
        });

        it('should be called when To > From + arrangeDate', () => {
            const result = handleAfterChangeToDate({ format: jest.fn(() => "12/12/2023") }, "06/12/2023", 6)

            expect(result).toEqual({ fromDate: "06/12/2023", toDate: "12/12/2023" });
        });

        it('should be called when To into From + arrangeDate', () => {
            const result = handleAfterChangeToDate({ format: jest.fn(() => "03/12/2022") }, "11/05/2021", 6)

            expect(result).toEqual({ fromDate: "11/05/2021", toDate: "03/12/2022" });
        });

        it('should be called when not has maxRangeDate', () => {
            const result = handleAfterChangeToDate({ format: jest.fn(() => "03/12/2022") }, "01/05/2021")

            expect(result).toEqual({ fromDate: "01/05/2021", toDate: "03/12/2022" });
        });
    });
})