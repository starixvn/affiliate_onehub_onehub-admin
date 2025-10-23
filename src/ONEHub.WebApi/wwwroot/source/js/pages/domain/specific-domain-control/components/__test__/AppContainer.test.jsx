import React from 'react';
import { AppContainer } from '../AppContainer';
import { shallow } from 'enzyme';
import AppLayout from '../../../../../layouts/AppLayout';
import Loader from '../../../../../components/Loader';
import Filter from '../Filter';
import Content from '../Content';
import SpecificDomainControlPopup from '../SpecificDomainControlPopup';

jest.mock('../../../../../layouts/AppLayout', () => {
    return function MockAppLayout({ children }) {
        return <div className="mock-app-layout">{children}</div>;
    };
});

jest.mock('../../../../../components/Loader', () => {
    return function MockLoader({ show }) {
        return <div className="mock-loader">{show ? 'Loading...' : ''}</div>;
    };
});

jest.mock('../Filter', () => {
    return function MockFilter() {
        return <div className="mock-filter">Filter</div>;
    };
});

jest.mock('../Content', () => {
    return function MockContent() {
        return <div className="mock-content">Content</div>;
    };
});

jest.mock('../SpecificDomainControlPopup', () => {
    return function MockSpecificDomainControlPopup() {
        return <div className="mock-popup">Popup</div>;
    };
});

describe('specific domain control - components - AppContainer ', () => {
    const defaultProps = {
        isShowLoader: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('render correctly', () => {
        const result = shallow(<AppContainer {...defaultProps} />);
        expect(result).toMatchSnapshot();
    });

    it('should render all child components', () => {
        const wrapper = shallow(<AppContainer {...defaultProps} />);
        
        expect(wrapper.find(AppLayout).exists()).toBe(true);
        expect(wrapper.find(Loader).exists()).toBe(true);
        expect(wrapper.find(Filter).exists()).toBe(true);
        expect(wrapper.find(Content).exists()).toBe(true);
        expect(wrapper.find(SpecificDomainControlPopup).exists()).toBe(true);
    });

    it('should pass isShowLoader prop to Loader component', () => {
        const wrapper = shallow(<AppContainer {...defaultProps} />);
        const loader = wrapper.find(Loader);
        
        expect(loader.prop('show')).toBe(false);
    });

    it('should show loader when isShowLoader is true', () => {
        const props = { ...defaultProps, isShowLoader: true };
        const wrapper = shallow(<AppContainer {...props} />);
        const loader = wrapper.find(Loader);
        
        expect(loader.prop('show')).toBe(true);
    });

    it('should not show loader when isShowLoader is false', () => {
        const wrapper = shallow(<AppContainer {...defaultProps} />);
        const loader = wrapper.find(Loader);
        
        expect(loader.prop('show')).toBe(false);
    });

    it('should render components in correct order', () => {
        const wrapper = shallow(<AppContainer {...defaultProps} />);
        const appLayout = wrapper.find(AppLayout);
        
        const children = appLayout.children();
        expect(children.at(0).type()).toBe(Loader);
        expect(children.at(1).type()).toBe(Filter);
        expect(children.at(2).type()).toBe(Content);
        expect(children.at(3).type()).toBe(SpecificDomainControlPopup);
    });

    it('should render with React.memo', () => {
        const wrapper = shallow(<AppContainer {...defaultProps} />);
        expect(wrapper.name()).toEqual('MockAppLayout');
    });
}); 