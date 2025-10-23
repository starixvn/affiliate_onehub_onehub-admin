import React from 'react';
import CommissionGroupPopup from '../CommissionGroupPopup';
import { shallow } from 'enzyme';

describe('common - components - CommissionGroupPopup', () => {
    const defaultProps = {
        showPopupCommGroup: true,
        affName: '12BETAFF226',
        affId: 1271808,
        isPrivateGroup: false,
        isNewAffiliate: true
    };

    it('render correctly', () => {
        const result = shallow(<CommissionGroupPopup {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with Private Group', () => {
        const props = Object.assign({}, defaultProps, { isPrivateGroup: true, isNewAffiliate: false });
        const result = shallow(<CommissionGroupPopup {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('componentWillUnmount - should call window.removeEventListener', () => {
        const result = shallow(<CommissionGroupPopup {...defaultProps} />);
        window.removeEventListener = jest.fn();

        result.instance().componentWillUnmount();

        expect(window.removeEventListener).toHaveBeenCalled();
    });

    it('handleClosePopupEvent - should call handleUpdatePrivateGroupSuccessfully', () => {
        const result = shallow(<CommissionGroupPopup {...defaultProps} />);
        const instance = result.instance();
        instance.handleUpdatePrivateGroupSuccessfully = jest.fn();

        instance.handleClosePopupEvent({ data: 'updatePrivateGroupSuccessfully' });

        expect(instance.handleUpdatePrivateGroupSuccessfully).toHaveBeenCalled();
    });

    it('handleClosePopupEvent - should call handleAssignGroupSuccessfully', () => {
        const result = shallow(<CommissionGroupPopup {...defaultProps} />);
        const instance = result.instance();
        instance.handleAssignGroupSuccessfully = jest.fn();

        instance.handleClosePopupEvent({ data: 'assignGroupSuccessfully' });

        expect(instance.handleAssignGroupSuccessfully).toHaveBeenCalled();
    });

    it('handleClosePopupEvent - should call handleChangeAssignToPrivateGroup', () => {
        const result = shallow(<CommissionGroupPopup {...defaultProps} />);
        const instance = result.instance();
        instance.handleChangeAssignToPrivateGroup = jest.fn();

        instance.handleClosePopupEvent({
            data: {
                eventName: 'changeAssignToPrivateGroup'
            }
        });

        expect(instance.handleChangeAssignToPrivateGroup).toHaveBeenCalled();
    });

    it('handleUpdatePrivateGroupSuccessfully - should call handleClosePopup', () => {
        const result = shallow(<CommissionGroupPopup {...defaultProps} />);
        const instance = result.instance();
        instance.handleClosePopup = jest.fn();

        instance.handleUpdatePrivateGroupSuccessfully();

        expect(instance.handleClosePopup).toHaveBeenCalled();
    });

    it('handleUpdatePrivateGroupSuccessfully - should call handleClosePopup and getAffiliateInfo', () => {
        const props = Object.assign({}, defaultProps, { getAffiliateInfo: jest.fn() });
        const result = shallow(<CommissionGroupPopup {...props} />);
        const instance = result.instance();
        instance.handleClosePopup = jest.fn();
        instance.setState({ isUsingPrivateGroup: true });

        instance.handleUpdatePrivateGroupSuccessfully();

        expect(instance.handleClosePopup).toHaveBeenCalled();
        expect(props.getAffiliateInfo).toHaveBeenCalledWith('12BETAFF226');
    });

    it('handleAssignGroupSuccessfully - should call setShowPopupCommGroup and getAffiliateInfo', () => {
        const props = Object.assign({}, defaultProps, { getAffiliateInfo: jest.fn(), setShowPopupCommGroup: jest.fn() });
        const result = shallow(<CommissionGroupPopup {...props} />);

        result.instance().handleAssignGroupSuccessfully();

        expect(props.setShowPopupCommGroup).toHaveBeenCalledWith(false);
        expect(props.getAffiliateInfo).toHaveBeenCalledWith('12BETAFF226');
    });

    it('handleChangeAssignToPrivateGroup - should call setState', () => {
        const result = shallow(<CommissionGroupPopup {...defaultProps} />);
        result.setState = jest.fn();

        result.instance().handleChangeAssignToPrivateGroup(1);

        expect(result.setState).toHaveBeenCalledWith({ isUsingPrivateGroup: true });
    });

    it('handleClosePopup - should call setShowPopupCommGroup and window.setTimeout', () => {
        const props = Object.assign({}, defaultProps, { setShowPopupCommGroup: jest.fn() });
        const result = shallow(<CommissionGroupPopup {...props} />);

        result.instance().handleClosePopup();

        expect(props.setShowPopupCommGroup).toHaveBeenCalledWith(false);
    });

    it('resetState - should call setState', () => {
        const result = shallow(<CommissionGroupPopup {...defaultProps} />);
        result.setState = jest.fn();

        result.instance().resetState();

        expect(result.setState).toHaveBeenCalledWith({ isUsingPrivateGroup: false });
    });
});