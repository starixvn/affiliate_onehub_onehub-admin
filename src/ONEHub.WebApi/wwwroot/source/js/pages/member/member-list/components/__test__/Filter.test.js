import React from 'react';
import { Filter } from '../Filter';
import { shallow, mount } from 'enzyme';

import { defaultPagingOption } from '../../../../../modules/constants';

describe('member list - components - Filter ', () => {
    const defaultProps = {
        pagingOption: defaultPagingOption,
        affName: '12BETAFF226',
        isFromOtherPages: false
    }

    it('render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('_handleSearch - should be called when click Search Button', () => {
        const setParam = jest.fn();
        const props = Object.assign({}, defaultProps, { setParam });
        const wrapper = shallow(<Filter {...props} />);

        wrapper.find('Button').simulate('click');

        expect(props.setParam).toHaveBeenCalledWith({ AffName: '12BETAFF226', UserName: '', IbcUserName: '', PageIndex: 1, PageSize: 20, IsIncludeRemovedPlayer: false });
    });

    it('setAffName - should change affName when change affiliate textbox', () => {
        const event = {
            target: { value: '12BET' }
        };
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find('Input[type="text"][name="affName"]').simulate('change', event);

        expect(wrapper.find('Input[type="text"][name="affName"]').prop('value')).toEqual('12BET');
    });

    it('setUserName - should change userName when change user name textbox', () => {
        const event = {
            target: { value: 'abc' }
        };
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find('Input[type="text"][name="userName"]').simulate('change', event);

        expect(wrapper.find('Input[type="text"][name="userName"]').prop('value')).toEqual('abc');
    });

    it('setIbcUserName - should change ibcUserName when change ibcUserName textbox', () => {
        const event = {
            target: { value: 'ibcUserName' }
        };
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find('Input[type="text"][name="ibcUserName"]').simulate('change', event);

        expect(wrapper.find('Input[type="text"][name="ibcUserName"]').prop('value')).toEqual('ibcUserName');
    });

    it('_handlePressEnter - should call _handleSearch when press enter in affiliate textbox', () => {
        const event = {
            charCode: 13,
            preventDefault: jest.fn()
        };
        const props = Object.assign({}, defaultProps, { setParam: jest.fn() })
        const wrapper = shallow(<Filter {...props} />);

        wrapper.find('Input[type="text"][name="affName"]').simulate('keyPress', event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(props.setParam).toHaveBeenCalledWith({ "AffName": "12BETAFF226", "IbcUserName": "", "PageIndex": 1, "PageSize": 20, "UserName": "", "IsIncludeRemovedPlayer": false });
    });

    it('_handlePressEnter - should call _handleSearch when press enter in user name textbox', () => {
        const event = {
            charCode: 13,
            preventDefault: jest.fn()
        };
        const props = Object.assign({}, defaultProps, { setParam: jest.fn() })
        const wrapper = shallow(<Filter {...props} />);

        wrapper.find('Input[type="text"][name="userName"]').simulate('keyPress', event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(props.setParam).toHaveBeenCalledWith({ "AffName": "12BETAFF226", "IbcUserName": "", "PageIndex": 1, "PageSize": 20, "UserName": "", "IsIncludeRemovedPlayer": false });
    });

    it('_handlePressEnter - should call _handleSearch when press enter in ibcUserName textbox', () => {
        const event = {
            charCode: 13,
            preventDefault: jest.fn()
        };
        const props = Object.assign({}, defaultProps, { setParam: jest.fn() })
        const wrapper = shallow(<Filter {...props} />);

        wrapper.find('Input[type="text"][name="ibcUserName"]').simulate('keyPress', event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(props.setParam).toHaveBeenCalledWith({ "AffName": "12BETAFF226", "IbcUserName": "", "PageIndex": 1, "PageSize": 20, "UserName": "", "IsIncludeRemovedPlayer": false });
    });

    it('_handlePressEnter - should not call _handleSearch when press other keys', () => {
        const event = {
            charCode: 16,
            preventDefault: jest.fn()
        };
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find('Input[type="text"][name="affName"]').simulate('keyPress', event);

        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('useEffect - should call setIsFromOtherPages, setParam', () => {
        const props = Object.assign({}, defaultProps, { isFromOtherPages: true, setIsFromOtherPages: jest.fn(), setParam: jest.fn() });

        mount(<Filter {...props} />);

        expect(props.setIsFromOtherPages).toHaveBeenCalledWith(false);
        expect(props.setParam).toHaveBeenCalledWith({ "AffName": "12BETAFF226", "IbcUserName": "", "PageIndex": 1, "PageSize": 20, "UserName": "", "IsIncludeRemovedPlayer": false });
    });

    it('useEffect - should not call setIsFromOtherPages, setParam', () => {
        const props = Object.assign({}, defaultProps, { setIsFromOtherPages: jest.fn(), setParam: jest.fn() });

        mount(<Filter {...props} />);

        expect(props.setIsFromOtherPages).not.toHaveBeenCalled();
        expect(props.setParam).not.toHaveBeenCalled();
    });
})