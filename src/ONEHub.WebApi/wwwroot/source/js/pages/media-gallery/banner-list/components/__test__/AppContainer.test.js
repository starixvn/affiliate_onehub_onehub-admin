import React from 'react';
import { AppContainer } from '../AppContainer';
import { shallow } from 'enzyme';
import ControlButtons from '../../../common/components/ControlButtons';

describe('banner list - components - AppContainer', () => {
    it('render correctly', () => {
        const result = shallow(<AppContainer isShowLoader={true} />);

        expect(result).toMatchSnapshot();
    });

    it('fetchData - should be called when call fetchData in ControlButons', () => {
        const param = {
            PageIndex: 1,
            PageSize: 20,
            category: "",
            currency: "",
            deviceType: 0,
            language: ""
        }
        const props = Object.assign({}, { isShowLoader: true, fetchData: jest.fn(), param })
        const result = shallow(<AppContainer {...props} />);

        result.find(ControlButtons).props().fetchData();

        expect(props.fetchData).toHaveBeenCalledWith(param);
    });

    it('deleteBanners - should be called when call deleteItems in ControlButons', () => {
        const param = {
            PageIndex: 1,
            PageSize: 20,
            category: "",
            currency: "",
            deviceType: 0,
            language: "",
            userType: '1'
        }
        const props = Object.assign({}, { isShowLoader: true, deleteBanners: jest.fn(), param })
        const result = shallow(<AppContainer {...props} />);

        result.find(ControlButtons).props().deleteItems('1,2,3');

        expect(props.deleteBanners).toHaveBeenCalledWith({ bannerIdList: '1,2,3', userType: param.userType });
    });
});