import React from 'react';
import { shallow } from 'enzyme';
import { GridData } from '../GridData';
import * as ajaxRequest from '../../../../modules/ajaxRequest';
import NotificationPopup from '../../../common/components/NotificationPopup';

describe('affiliate info - GridData ', () => {
    const targetCountryList = {
        'MY': 'Malaysia',
        'TH': 'Thailand',
        'CN': 'China'
    };

    const dataItem = {
        AffId: 927841,
        UserName: "12BETAFF001",
        Status: "Approved",
        FirstName: "",
        LastName: "媒体册 获取以更新吧！",
        Language: "hi-IN",
        TargetCountryCode: "MY",
        Email: "walter.tran1@starixsoft.com",
        RegistrationDate: "\/Date(1211413740000)\/",
        ApprovalDate: "\/Date(1211413800000)\/",
        CasinoDate: "\/Date(1400778000000)\/",
        CommissionGroup: "12BETAFF001",
        BalanceBf: -4439.0000,
        Member: 6,
        IsFavorite: false,
        RegistrationDateText: "05/22/2008 06:49:00",
        ApprovalDateText: "05/22/2008 06:50:00",
        IsUsingPrivateCommGroup: true
    };
    const index = 1;
    const dataList = [dataItem, { ...dataItem, CommissionGroup: 'test' }];
    const mockColumnList = [
        { columnKey: "Index", columnName: "#", checked: true },
        { columnKey: "Status", columnName: "Status", checked: true },
        { columnKey: "FirstName", columnName: "First Name", checked: true },
        { columnKey: "LastName", columnName: "Last Name", checked: true },
        { columnKey: "Language", columnName: "Language", checked: true },
        { columnKey: "Phone", columnName: "Mobile Phone", checked: true },
        { columnKey: "Email", columnName: "Email", checked: true },
        { columnKey: "RegistrationDateText", columnName: "Registration Date", checked: true },
        { columnKey: "ApprovalDateText", columnName: "Approval Date", checked: true },
        { columnKey: "CommissionGroup", columnName: "Commission Group", checked: true },
        { columnKey: "BalanceBf", columnName: "Balance B/F", checked: true },
        { columnKey: "Currency", columnName: "Aff. Currency", checked: true },
        { columnKey: "PlayerUserName", columnName: "Aff. Player", checked: false },
        { columnKey: "PlayerCurrency", columnName: "Aff. Player Currency", checked: false },
        { columnKey: "Member", columnName: "Member", checked: true }
    ];
    const selectedColumnList = {
        Index: true,
        Status: true,
        FirstName: true,
        LastName: true,
        Language: true,
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
        pagingOption: {
            PageIndex: 1,
            PageSize: 20,
            TotalItem: 0,
            PageList: [10, 20, 50, 100, 500]
        },
        languageList: {},
        claimsPrincipal: { hasWriteClaim: jest.fn(() => true) },
        param: {
            AffCode: '',
            GroupId: 0,
            Language: '',
            Status: '',
            UserName: '',
            Email: '',
            SortBy: 1,
            SortDirectionType: false
        }
    };

    it('componentDidUpdate - should call fetchData if param change', () => {
        const propParam = Object.assign({}, defaultProps.param, { SortBy: 0 });
        const props = Object.assign({}, defaultProps, { param: propParam });
        const componentInstance = new GridData(props);
        componentInstance.fetchData = jest.fn();
        componentInstance.componentDidUpdate(defaultProps);

        const param = {
            AffCode: '',
            GroupId: 0,
            Language: '',
            Status: '',
            UserName: '',
            Email: '',
            SortBy: 0,
            SortDirectionType: false,
            PageIndex: 1,
            PageSize: 20
        }

        expect(componentInstance.fetchData).toHaveBeenCalledWith(param);
    });

    it('fetchData - should call toggleLoader, setState and setPagingOption with correct parameter', async () => {
        const expectedResponse = { data: { MainData: 1, TotalItem: 1 }, status: 200 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const mockToggleLoader = jest.fn();
        const mockSetPagingOption = jest.fn();

        const props = Object.assign({}, defaultProps, { toggleLoader: mockToggleLoader, setPagingOption: mockSetPagingOption });
        const componentInstance = new GridData(props);
        componentInstance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { PageIndex: 1, PageSize: 20 });
        await componentInstance.fetchData(param);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);

        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: 1, shouldResetScrollPosition: true });

        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 1, PageIndex: 1, PageSize: 20 });
    });

    it('fetchData - not call setState and setPagingOption with correct parameter', async () => {
        const expectedResponse = { data: { MainData: 1, TotalItem: 1 }, status: 500 };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const mockToggleLoader = jest.fn();
        const mockSetPagingOption = jest.fn();

        const props = Object.assign({}, defaultProps, { toggleLoader: mockToggleLoader, setPagingOption: mockSetPagingOption });
        const componentInstance = new GridData(props);
        componentInstance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { PageIndex: 1, PageSize: 20 });
        await componentInstance.fetchData(param);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);

        expect(componentInstance.setState).not.toHaveBeenCalledWith({ gridData: 1, shouldResetScrollPosition: true });

        expect(props.setPagingOption).not.toHaveBeenCalledWith({ TotalItem: 1, PageIndex: 1, PageSize: 20 });
    });

    it('fetchData - not call toggleLoader and setPagingOption with incorrect parameter', async () => {
        const mockToggleLoader = jest.fn();
        const mockSetPagingOption = jest.fn();

        const props = Object.assign({}, defaultProps, { toggleLoader: mockToggleLoader, setPagingOption: mockSetPagingOption });
        const componentInstance = new GridData(props);
        componentInstance.setState = jest.fn();
        const param = Object.assign({}, defaultProps.param, { AffCode: 'abc', PageIndex: 1, PageSize: 20 });
        await componentInstance.fetchData(param);

        expect(props.toggleLoader).toHaveBeenCalledTimes(2);
        expect(props.toggleLoader.mock.calls[0][0]).toBe(true);
        expect(props.toggleLoader.mock.calls[1][0]).toBe(false);

        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: {}, shouldResetScrollPosition: true });

        expect(props.setPagingOption).toHaveBeenCalledWith({ TotalItem: 0, PageIndex: 1, PageSize: 20 });
    });

    it('handleToggleFavorite - should call saveToggleFavorite with correct parameters', () => {
        const affId = 927841;
        const isFavorite = true;
        const param = {
            AffId: affId,
            IsFavorite: !isFavorite
        }
        const componentInstance = new GridData(defaultProps);
        componentInstance.saveToggleFavorite = jest.fn();
        componentInstance.handleToggleFavorite(affId, isFavorite);

        expect(componentInstance.saveToggleFavorite).toHaveBeenCalledWith(param);

    });

    it('saveToggleFavorite - should call setState with correct parameter', async () => {
        const param = {
            AffId: 927841,
            IsFavorite: true
        }
        const dataItemExpect = Object.assign({}, dataItem, { IsFavorite: true });
        const gridData = [dataItem];

        const expectedResponse = { data: { Code: 0, Message: "", IsSuccessful: true } };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const componentInstance = new GridData(defaultProps);
        componentInstance.state.gridData = gridData;

        componentInstance.setState = jest.fn();
        await componentInstance.saveToggleFavorite(param);

        expect(componentInstance.setState).toHaveBeenCalledWith({ gridData: [dataItemExpect], shouldResetScrollPosition: false });
    });

    it('saveToggleFavorite - call setState with the response is not successful', async () => {
        const param = {
            AffId: 927841,
            IsFavorite: true
        }

        const expectedResponse = { data: { Code: 0, Message: "Toggle favorite is failed!", IsSuccessful: false } };
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const componentInstance = new GridData(defaultProps);
        window.alert = jest.fn();
        componentInstance.setState = jest.fn();

        await componentInstance.saveToggleFavorite(param);

        expect(componentInstance.setState).toHaveBeenCalledWith({ "messageNotification": "Toggle favorite is failed!" });
    });

    it('saveToggleFavorite - not call setState with incorrect parameter', async () => {
        const param = null;

        const expectedResponse = null;
        ajaxRequest.post = jest.fn(() => Promise.resolve(expectedResponse));

        const componentInstance = new GridData(defaultProps);

        componentInstance.setState = jest.fn();
        await componentInstance.saveToggleFavorite(param);

        expect(componentInstance.setState).not.toHaveBeenCalledWith();
    });

    it('handleChangePassword - should call setShowPopupPassword and setAffId with correct parameters', () => {
        const mockSetShowPopupPassword = jest.fn();
        const mockSetAffId = jest.fn();

        const affId = 927841;
        const props = Object.assign({}, defaultProps, { setShowPopupPassword: mockSetShowPopupPassword, setAffId: mockSetAffId });
        const componentInstance = new GridData(props);

        componentInstance.handleChangePassword(affId);

        expect(props.setShowPopupPassword).toHaveBeenCalledWith(true);
        expect(props.setAffId).toHaveBeenCalledWith(affId);
    });

    it('handleEditCommGroup - should call setShowPopupCommGroup, setAffId and setCommGroup with correct parameters', () => {
        const mockSetShowPopupCommGroup = jest.fn();
        const mockSetAffId = jest.fn();
        const mockSetCommGroup = jest.fn();

        const affId = 927841;
        const commGroup = 1;
        const props = Object.assign({}, defaultProps, { setShowPopupCommGroup: mockSetShowPopupCommGroup, setAffId: mockSetAffId, setCommGroup: mockSetCommGroup });
        const componentInstance = new GridData(props);

        componentInstance.handleEditCommGroup(affId, commGroup);

        expect(props.setShowPopupCommGroup).toHaveBeenCalledWith(true);
        expect(props.setAffId).toHaveBeenCalledWith(affId);
        expect(props.setCommGroup).toHaveBeenCalledWith(commGroup);
    });

    it('handlePaging - should call setPagingOption and fetchData with correct parameters', () => {
        const mockSetPagingOption = jest.fn();

        const size = 20;
        const newPaging = {
            PageIndex: index,
            PageSize: size
        };
        const paramExpect = Object.assign({}, defaultProps.param, newPaging);

        const props = Object.assign({}, defaultProps, { setPagingOption: mockSetPagingOption });
        const componentInstance = new GridData(props);
        componentInstance.fetchData = jest.fn();

        componentInstance.handlePaging(index, size);

        expect(props.setPagingOption).toHaveBeenCalledWith(newPaging);
        expect(componentInstance.fetchData).toHaveBeenCalledWith(paramExpect);
    });

    it('should render correctly with _renderHeader', () => {
        const componentInstance = new GridData(defaultProps);

        const renderHeader = shallow(<div>{componentInstance._renderHeader(selectedColumnList)}</div>);

        expect(renderHeader).toMatchSnapshot();
    });

    it('should render correctly with _renderDataSection', () => {
        const componentInstance = new GridData(defaultProps);

        const renderDataSection = shallow(<div>{componentInstance._renderDataSection(dataList, selectedColumnList)}</div>);

        expect(renderDataSection).toMatchSnapshot();
    });

    it("_buildDataRow - should render correctly with dataItem's fields are not null", () => {
        const componentInstance = new GridData(defaultProps);

        const buildDataRow = shallow(<div>{componentInstance._buildDataRow(dataItem, index, selectedColumnList)}</div>);

        expect(buildDataRow).toMatchSnapshot();
    });

    it("_buildDataRow - should render correctly with dataItem's fields are null", () => {
        const item = {
            AffId: 927841,
            UserName: "12BETAFF001",
            Status: "Favorite",
            FirstName: "",
            LastName: "媒体册 获取以更新吧！",
            Language: "hi-IN",
            Email: "walter.tran1@starixsoft.com",
            RegistrationDate: "\/Date(1211413740000)\/",
            ApprovalDate: "\/Date(1211413800000)\/",
            CasinoDate: "\/Date(1400778000000)\/",
            CommissionGroup: "COMMISSION",
            BalanceBf: null,
            Member: null,
            IsFavorite: true,
            RegistrationDateText: "05/22/2008 06:49:00",
            ApprovalDateText: "05/22/2008 06:50:00"
        };

        const componentInstance = new GridData(defaultProps);

        const buildDataRow = shallow(<div>{componentInstance._buildDataRow(item, index, selectedColumnList)}</div>);

        expect(buildDataRow).toMatchSnapshot();
    });


    it("should call handleEditCommGroup when click button commGroup", () => {
        const wrapper = shallow(<GridData {...defaultProps} />);

        wrapper.instance().handleEditCommGroup = jest.fn();

        const buildDataRow = shallow(<div>{wrapper.instance()._buildDataRow(dataItem, index, selectedColumnList)}</div>);

        buildDataRow.find('Button').at(0).simulate('click');
        expect(wrapper.instance().handleEditCommGroup).toHaveBeenCalledWith(927841, '12BETAFF001');
    });

    it("should call handleToggleFavorite when click icon favorite", () => {
        const wrapper = shallow(<GridData {...defaultProps} />);

        wrapper.instance().handleToggleFavorite = jest.fn();

        const buildDataRow = shallow(<div>{wrapper.instance()._buildDataRow(dataItem, index, selectedColumnList)}</div>);

        buildDataRow.find('span[className="favor-uncheck"]').simulate('click');
        expect(wrapper.instance().handleToggleFavorite).toHaveBeenCalledWith(927841, false);
    });

    it("should call handleChangePassword when click button change password", () => {
        const wrapper = shallow(<GridData {...defaultProps} />);

        wrapper.instance().handleChangePassword = jest.fn();

        const buildDataRow = shallow(<div>{wrapper.instance()._buildDataRow(dataItem, index, selectedColumnList)}</div>);

        buildDataRow.find('Button').at(1).simulate('click');
        expect(wrapper.instance().handleChangePassword).toHaveBeenCalledWith(927841);
    });

    it('_resetScroll - should reset scroll', () => {
        const expectCurrent = {
            scrollTop: 0,
            scrollLeft: 0
        };

        const componentInstance = new GridData(defaultProps);
        componentInstance.tableRef = {
            current: {
                scrollTop: 123,
                scrollLeft: 234
            }
        };

        componentInstance._resetScroll();

        expect(componentInstance.tableRef.current).toEqual(expectCurrent);
    });

    it('should render correctly', () => {
        const wrapper = shallow(<GridData {...defaultProps} />);
        wrapper.instance().setState({ gridData: dataList });

        expect(wrapper).toMatchSnapshot();
    });

    it('should render correctly with no data', () => {
        const wrapper = shallow(<GridData {...defaultProps} />);
        wrapper.instance().setState({ gridData: [] });

        expect(wrapper).toMatchSnapshot();
    });

    it("setState - should be called when click close in NotificationPopup", () => {
        const wrapper = shallow(<GridData {...defaultProps} />);
        wrapper.setState({ messageNotification: "123", gridData: [] });
        wrapper.setState = jest.fn();

        wrapper.find(NotificationPopup).props().onClose();
        expect(wrapper.setState).toHaveBeenCalledWith({ messageNotification: '' });
    });
})