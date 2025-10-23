import * as services from '../service';
import * as ajaxRequest from '../../../../../modules/ajaxRequest';

describe('user panel services', () => {
    it('isActiveMenu - should return false', async () => {
        const selectedMenu = {
            key: "statementHistory",
            name: "Statement History",
            parent: null
        }

        const menuItem = {
            key: "statementHistory",
            name: "Statement History",
            parent: null
        }

        const result = await services['isActiveMenu'](selectedMenu, menuItem);

        expect(result).toBe(true);
    })

    it('isActiveMenu - should return false with have parent', async () => {
        const selectedMenu = {
            key: "dailyEarning",
            name: "",
            parent: "statementHistory"
        }

        const menuItem = {
            key: "statementHistory",
            name: "Statement History",
            parent: null
        }

        const result = await services['isActiveMenu'](selectedMenu, menuItem);

        expect(result).toBe(true);
    })

    it('isActiveMenu - should return false', async () => {
        const menuItem = {
            key: "statementHistory",
            name: "Statement History",
            parent: null
        }

        const result = await services['isActiveMenu']({}, menuItem);

        expect(result).toBe(false);
    })

    it('isActiveMenu - should return null with selectedMenu null', async () => {
        const menuItem = {
            key: "statementHistory",
            name: "Statement History",
            parent: null
        }

        const result = await services['isActiveMenu'](null, menuItem);

        expect(result).toEqual(null);
    })

    it('getPageList - should return correct data', async () => {
        const expectedResponse = {
            data: [
                { PageId: 1, PageName: "Sportsbook", PageCode: "sportsbook" },
                { PageId: 2, PageName: "Home", PageCode: "home" },
                { PageId: 18, PageName: "Casino", PageCode: "casino" },
                { PageId: 26, PageName: "Live Casino", PageCode: "livecasino" }
            ],
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const result = await services['getPageList']();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CommonSetting/GetPageList');
        expect(result).toEqual(expectedResponse.data);
    })

    it('getPageList - should return empty data', async () => {
        ajaxRequest.post = jest.fn();

        const result = await services['getPageList']();

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CommonSetting/GetPageList');

        expect(result).toEqual([]);
    })

    it('getTrackingCodeList - should return correct data', async () => {
        const expectedResponse = {
            data: ["[None]", "Casino", "Sportsbook"],
            status: 200
        };

        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const result = await services['getTrackingCodeList'](1271808);

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CommonSetting/GetTrackingCodeList', { affId: 1271808 });
        expect(result).toEqual(expectedResponse.data);
    })

    it('getTrackingCodeList - should return empty data', async () => {
        ajaxRequest.post = jest.fn();

        const result = await services['getTrackingCodeList'](1271808);

        expect(ajaxRequest.post).toHaveBeenCalledWith('Portal/CommonSetting/GetTrackingCodeList', { affId: 1271808 });

        expect(result).toEqual([]);
    })
});