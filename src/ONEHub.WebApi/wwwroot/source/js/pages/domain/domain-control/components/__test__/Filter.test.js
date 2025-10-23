import React from 'react';
import { Filter } from '../Filter';
import { shallow } from 'enzyme';

describe('domain control - components - Filter ', () => {
    const defaultProps = {
        targetCountryList: [
            {
                TargetCountryCode: "en-GB",
                TargetCountryName: "English (Euro)"
            },
            {
                TargetCountryCode: "vi-VN",
                TargetCountryName: "VietNamese"
            }
        ],
        affSubDomainList: [
            {
                columnKey: "test",
                columnName: "test",
                checked: true
            }
        ]
    }

    it('render correctly', () => {
        const result = shallow(<Filter {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('_handleSearch - should be called when click Search Button', () => {
        const props = Object.assign({}, defaultProps, { setSelectedTargetCountry: jest.fn(), fetchData: jest.fn() });
        const wrapper = shallow(<Filter {...props} />);

        wrapper.find('Button').simulate('click');

        expect(props.setSelectedTargetCountry).toHaveBeenCalledWith('');
        expect(props.fetchData).toHaveBeenCalledWith('', defaultProps.affSubDomainList);
    });

    it('setTargetCountry - should change category when change target country select', () => {
        const event = {
            target: { value: 'en-GB' }
        };
        const wrapper = shallow(<Filter {...defaultProps} />);

        wrapper.find('Input[type="select"][name="targetCountry"]').simulate('change', event);

        expect(wrapper.find('Input[type="select"][name="targetCountry"]').prop('value')).toEqual('en-GB');
    });
})