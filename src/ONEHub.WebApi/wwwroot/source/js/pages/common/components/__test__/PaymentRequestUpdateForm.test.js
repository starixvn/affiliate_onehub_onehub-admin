import React from 'react';
import { PaymentRequestUpdateForm } from '../PaymentRequestUpdateForm';
import { shallow } from 'enzyme';

describe('common - components - PaymentRequestUpdateForm', () => {
    const paymentRequestInfo = {
        AffId: 1271808,
        Email: "hubert.duong_1@nexcel.vn",
        FirstName: "Hinh",
        LastName: "L&#234; Văn",
        PaymentMethod: "Player",
        PlayerUsername: "bettingexp",
        AdminDesc: "Visible only to admin encode",
        AffDesc: "Visible also to affiliate encode",
        TransDateText: "08/09/2019 03:43:17 AM",
        CompletedDateText: "08/16/2019 02:52:48 AM",
        TransId: 1262276212,
        Status: "Processing",
        AffName: "12BETAFF226",
        Amount: 100,
        Creator: "AAwalter"
    };

    it('render correctly', () => {
        const result = shallow(<PaymentRequestUpdateForm />);
        result.setState({ paymentRequestInfo, originalStatus: 'processing' });

        expect(result).toMatchSnapshot();
    });

    it('render correctly with not Processing', () => {
        const result = shallow(<PaymentRequestUpdateForm />);
        result.setState({ paymentRequestInfo, originalStatus: 'approved', isSuccess: false });

        expect(result).toMatchSnapshot();
    });


    it('handleClosePopup - should call props.handleClosePopup and setState', () => {
        const props = Object.assign({}, { handleClosePopup: jest.fn() });
        const result = shallow(<PaymentRequestUpdateForm {...props} />);
        result.setState = jest.fn();

        result.instance().handleClosePopup();

        expect(props.handleClosePopup).toHaveBeenCalled();
        expect(result.setState).toHaveBeenCalledWith({ paymentRequestInfo: null });
    });

    it('hideMessage - should call setState', () => {
        const result = shallow(<PaymentRequestUpdateForm />);
        result.setState = jest.fn();

        result.instance().hideMessage();

        expect(result.setState).toHaveBeenCalledWith({ isShowMessage: false });
    });

    it('componentDidUpdate - should call handleGetPaymentRequestInfo', () => {
        const result = shallow(<PaymentRequestUpdateForm transactionId={1271808} />);
        const instance = result.instance();
        instance.handleGetPaymentRequestInfo = jest.fn();

        instance.componentDidUpdate({ transactionId: 0 });

        expect(instance.handleGetPaymentRequestInfo).toHaveBeenCalledWith(1271808);
    });

    it('handleChange - should call setState', () => {
        const result = shallow(<PaymentRequestUpdateForm />);
        const instance = result.instance();
        instance.setState({ paymentRequestInfo });
        instance.setState = jest.fn();

        instance.handleChange({ target: { name: 'LastName', value: 'Lê Văn' } });

        expect(instance.setState).toHaveBeenCalledWith({ paymentRequestInfo: { ...paymentRequestInfo, LastName: 'Lê Văn' } });
    });

    it('handleGetPaymentRequestInfo - should call getPaymentRequestDetail and setState', async () => {
        const props = { getPaymentRequestDetail: jest.fn(() => paymentRequestInfo) };
        const result = shallow(<PaymentRequestUpdateForm {...props} />);
        const instance = result.instance();
        instance.setState({ paymentRequestInfo });
        instance.setState = jest.fn();

        await instance.handleGetPaymentRequestInfo(1271808);

        expect(props.getPaymentRequestDetail).toHaveBeenCalledWith({ transId: 1271808 });
        expect(instance.setState).toHaveBeenCalledWith({ paymentRequestInfo, originalStatus: 'Processing', "isSendingRequest": false });
    });

    it('handleSave - should call updatePaymentRequest, handleFetchData, handleClosePopup and setState', async () => {
        const paymentRequest = Object.assign({}, paymentRequestInfo, { Status: 'Approved' });
        const expectedResponse = { IsSuccessful: true, }
        const props = { updatePaymentRequest: jest.fn(() => expectedResponse), handleFetchData: jest.fn(), handleClosePopup: jest.fn() };
        const result = shallow(<PaymentRequestUpdateForm {...props} />);
        const instance = result.instance();
        instance.setState({ paymentRequestInfo: paymentRequest, originalStatus: 'Processing' });
        instance.setState = jest.fn((obj, fn) => fn && fn());
        instance.hideMessage = jest.fn();

        await instance.handleSave();

        expect(props.updatePaymentRequest).toHaveBeenCalledWith({ AdminDesc: "Visible only to admin encode", AffDesc: "Visible also to affiliate encode", AffId: 1271808, IsApproved: true, TransId: 1262276212 });
        expect(instance.setState).toHaveBeenCalledTimes(2);
        expect(instance.setState.mock.calls[0][0]).toEqual({ isSendingRequest: true });
        expect(instance.setState.mock.calls[1][0]).toEqual({ isShowMessage: true, isSuccess: true, message: 'Transaction ID 1262276212 has been updated successfully!' });
        expect(instance.setState.mock.calls[1][1]).toEqual(expect.any(Function));
    });

    it('handleSave - should call updatePaymentRequest and setState when save failed', async () => {
        const paymentRequest = Object.assign({}, paymentRequestInfo, { Status: 'Approved' });
        const expectedResponse = { IsSuccessful: false, Message: 'Failed!' };
        const props = { updatePaymentRequest: jest.fn(() => expectedResponse), handleFetchData: jest.fn(), handleClosePopup: jest.fn() };
        const result = shallow(<PaymentRequestUpdateForm {...props} />);
        const instance = result.instance();
        instance.setState({ paymentRequestInfo: paymentRequest, originalStatus: 'Processing' });
        instance.setState = jest.fn((obj, fn) => fn && fn());
        instance.hideMessage = jest.fn();

        await instance.handleSave();

        expect(props.updatePaymentRequest).toHaveBeenCalledWith({ AdminDesc: "Visible only to admin encode", AffDesc: "Visible also to affiliate encode", AffId: 1271808, IsApproved: true, TransId: 1262276212 });
        expect(instance.setState).toHaveBeenCalledTimes(2);
        expect(instance.setState.mock.calls[0][0]).toEqual({ isSendingRequest: true });
        expect(instance.setState.mock.calls[1][0]).toEqual({ isShowMessage: true, isSuccess: false, message: 'Failed!' });
        expect(instance.setState.mock.calls[1][1]).toEqual(expect.any(Function));
        expect(props.handleFetchData).not.toHaveBeenCalled();
        expect(props.handleClosePopup).not.toHaveBeenCalled();
    });

    it('handleSave - should call updatePaymentRequest and setState when save error', async () => {
        const paymentRequest = Object.assign({}, paymentRequestInfo, { Status: 'Rejected' });
        const props = { updatePaymentRequest: jest.fn(), handleFetchData: jest.fn(), handleClosePopup: jest.fn() };
        const result = shallow(<PaymentRequestUpdateForm {...props} />);
        const instance = result.instance();
        instance.setState({ paymentRequestInfo: paymentRequest, originalStatus: 'Processing' });
        instance.setState = jest.fn((obj, fn) => fn && fn());
        instance.hideMessage = jest.fn();

        await instance.handleSave();

        expect(props.updatePaymentRequest).toHaveBeenCalledWith({ AdminDesc: "Visible only to admin encode", AffDesc: "Visible also to affiliate encode", AffId: 1271808, IsApproved: false, TransId: 1262276212 });
        expect(instance.setState).toHaveBeenCalledTimes(2);
        expect(instance.setState.mock.calls[0][0]).toEqual({ isSendingRequest: true });
        expect(instance.setState.mock.calls[1][0]).toEqual({ isShowMessage: true, isSuccess: false, message: 'Update transaction failed!' });
        expect(instance.setState.mock.calls[1][1]).toEqual(expect.any(Function));
        expect(props.handleFetchData).not.toHaveBeenCalled();
        expect(props.handleClosePopup).not.toHaveBeenCalled();
    });

    it('handleSave - should call setState with invalid data', async () => {
        const result = shallow(<PaymentRequestUpdateForm />);
        const instance = result.instance();
        instance.setState({ paymentRequestInfo });
        instance.hideMessage = jest.fn();
        instance.setState = jest.fn((obj, fn) => fn && fn());

        await instance.handleSave();

        expect(instance.setState).toHaveBeenCalledTimes(1);
        expect(instance.setState.mock.calls[0][0]).toEqual({ isShowMessage: true, isSuccess: false, message: 'You must choose Approved or Rejected for this request!' });
        expect(instance.setState.mock.calls[0][1]).toEqual(expect.any(Function));
    });
});