import React from 'react';
import { SearchBox } from '../SearchBox';
import { shallow } from 'enzyme';

describe('left panel - components - SearchBox', () => {
    it('render correctly has props is null', () => {
        const result = shallow(<SearchBox />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly', () => {
        const props = {
            affName: '12BETAFF226',
            isValidUserName: true,
            getAffiliateInfo: jest.fn()
        }

        const result = shallow(<SearchBox {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('componentDidMount - should call getAffiliateInfo with affName is not null', () => {
        const getAffiliateInfo = jest.fn();
        const props = Object.assign({}, { getAffiliateInfo, affName: '12BETAFF226' });
        const wrapper = new SearchBox(props);

        wrapper.componentDidMount();

        expect(props.getAffiliateInfo).toHaveBeenCalledWith('12BETAFF226');
    });

    it('componentDidUpdate - should call setState if param change', () => {
        const props = { affName: "12BETAFF001" };
        const wrapper = new SearchBox(props);
        wrapper.setState = jest.fn();
        wrapper.componentDidUpdate({ affName: '' });

        expect(wrapper.setState).toHaveBeenCalledWith({ affName: "12BETAFF001" });
    });

    it('componentDidUpdate - should not call setState', () => {
        const props = { affName: "12BETAFF001" };
        const wrapper = new SearchBox(props);
        wrapper.setState = jest.fn();
        wrapper.componentDidUpdate({ affName: '12BETAFF001' });

        expect(wrapper.setState).not.toHaveBeenCalled();
    });

    it('handleChange - should call setState when change search input', () => {
        const event = {
            target: {
                name: 'affName',
                value: '12BETAFF226'
            }
        };
        const wrapper = shallow(<SearchBox />);
        wrapper.setState = jest.fn();

        wrapper.find('Input[type="text"][name="affName"]').simulate('change', event);

        expect(wrapper.setState).toHaveBeenCalledWith({ affName: '12BETAFF226' });
    });

    it('handlePressEnter - should call handleClick when press Enter', () => {
        const event = { charCode: 13, preventDefault: jest.fn() };

        const wrapper = shallow(<SearchBox />);
        const instance = wrapper.instance();
        instance.handleClick = jest.fn();

        wrapper.find('Input[type="text"][name="affName"]').simulate('keyPress', event);

        expect(instance.handleClick).toHaveBeenCalledWith(event);
    });

    it('handlePressEnter - should not call handleClick when press other keyboards', () => {
        const event = { charCode: 123 };

        const wrapper = shallow(<SearchBox />);
        const instance = wrapper.instance();
        instance.handleClick = jest.fn();

        wrapper.find('Input[type="text"][name="affName"]').simulate('keyPress', event);

        expect(instance.handleClick).not.toHaveBeenCalled();
    });

    it('handleClick - should call setAffName and getAffiliateInfo when click search button', () => {
        const event = {
            preventDefault: jest.fn()
        };
        const setAffName = jest.fn();
        const getAffiliateInfo = jest.fn();
        const props = Object.assign({}, { setAffName, getAffiliateInfo, affName: '12BETAFF226' });
        const wrapper = shallow(<SearchBox {...props} />);

        wrapper.find('Button[id="search-affName"]').simulate('click', event);

        expect(props.setAffName).toHaveBeenCalledWith('12BETAFF226');
        expect(props.getAffiliateInfo).toHaveBeenCalledWith('12BETAFF226');
    });
});