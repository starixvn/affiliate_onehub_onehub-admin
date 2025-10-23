jest.mock('redux');
jest.mock('react-redux');
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('message - Content - connect', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../Content');
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            pagingOption: { PageIndex: 1 },
            param: { isGetAll: true },
            checkedMessages: { 123: false },
            gridData: []
        };
        const state = {
            pagingOption: { PageIndex: 1 },
            param: { isGetAll: true },
            checkedMessages: { 123: false },
            gridData: [],
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            setSelectedMessageId: actions['setSelectedMessageId'],
            fetchData: actions['fetchData'],
            setPagingOption: actions['setPagingOption'],
            setCheckedMessages: actions['setCheckedMessages'],
            setShouldResetScrollPosition: actions['setShouldResetScrollPosition'],
            setParam: actions['setParam']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const Content = require('../../Content').Content;

        expect(connectMock).toHaveBeenCalledWith(React.memo(Content));
    })
})