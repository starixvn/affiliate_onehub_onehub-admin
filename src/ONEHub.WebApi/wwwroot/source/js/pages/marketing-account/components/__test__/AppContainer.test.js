import React from 'react';
import { AppContainer } from '../AppContainer';
import { shallow } from 'enzyme';

describe('marketing-account - components - AppContainer', () => {
    const defaultProps = {
        isShowLoader: false,
        isShowAddAffMktAccountPopup: false,
        setIsShowAddAffMktAccountPopup: jest.fn(),
        setAff: jest.fn()
    };

    it('render correctly', () => {
        const result = shallow(<AppContainer {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with loader showing', () => {
        const props = { ...defaultProps, isShowLoader: true };
        const result = shallow(<AppContainer {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with AddAffMktAccountPopup showing', () => {
        const props = { ...defaultProps, isShowAddAffMktAccountPopup: true };
        const result = shallow(<AppContainer {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('should handle toggle AddAffMktAccountPopup correctly', () => {
        const mockSetIsShow = jest.fn();
        const mockSetAff = jest.fn();
        const props = {
            ...defaultProps,
            isShowAddAffMktAccountPopup: true,
            setIsShowAddAffMktAccountPopup: mockSetIsShow,
            setAff: mockSetAff
        };
        
        const wrapper = shallow(<AppContainer {...props} />);
        // When isShowAddAffMktAccountPopup is true, the popup is the third Connect(Component) 
        // (Filter is index 0, Content is index 1, AddAffMktAccountPopup is index 2)
        const connectComponents = wrapper.find('Connect(Component)');
        const popup = connectComponents.at(2);
        
        // Simulate toggle
        popup.prop('toggle')();
        
        expect(mockSetIsShow).toHaveBeenCalledWith(false);
        expect(mockSetAff).toHaveBeenCalledWith({ affId: '', affName: '' });
    });

    it('should not render popup when isShowAddAffMktAccountPopup is false', () => {
        const props = {
            ...defaultProps,
            isShowAddAffMktAccountPopup: false
        };
        
        const wrapper = shallow(<AppContainer {...props} />);
        const connectComponents = wrapper.find('Connect(Component)');
        
        // When popup is not shown, there should only be 2 Connect components (Filter and Content)
        expect(connectComponents).toHaveLength(2);
    });
}); 