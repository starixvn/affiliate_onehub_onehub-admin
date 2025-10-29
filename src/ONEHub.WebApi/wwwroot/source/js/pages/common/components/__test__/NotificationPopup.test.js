import React from 'react';
import NotificationPopup from '../NotificationPopup';
import { shallow } from 'enzyme';
import { Modal } from 'reactstrap';

describe('common - components - NotificationPopup', () => {
    const defaultProps = { onClose: jest.fn() };

    it('Notification Popup - render correctly', () => {
        const result = shallow(<NotificationPopup {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('Notification Popup - onClose - should be called when click button OK', () => {
        const result = shallow(<NotificationPopup {...defaultProps} />);
        result.find('Button').simulate('click');

        expect(defaultProps.onClose).toHaveBeenCalledWith(false);
    });

    it('Confirm Popup - render correctly', () => {
        const props = Object.assign({}, defaultProps, { isConfirmPopup: true });
        const result = shallow(<NotificationPopup {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('Confirm Popup - onClose - should be called when click button OK', () => {
        const props = Object.assign({}, defaultProps, { isConfirmPopup: true });
        const result = shallow(<NotificationPopup {...props} />);
        result.find('Button').at(0).simulate('click');

        expect(props.onClose).toHaveBeenCalledWith(true);
    });

    it('Confirm Popup - onClose - should be called when click button Cancel', () => {
        const props = Object.assign({}, defaultProps, { isConfirmPopup: true });
        const result = shallow(<NotificationPopup {...props} />);
        result.find('Button').at(1).simulate('click');

        expect(props.onClose).toHaveBeenCalledWith(false);
    });

    it('onClose - should be called when click toggle', () => {
        const result = shallow(<NotificationPopup {...defaultProps} />);
        result.find(Modal).props().toggle();

        expect(defaultProps.onClose).toHaveBeenCalled();
    });
});