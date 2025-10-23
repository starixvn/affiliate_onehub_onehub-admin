jest.mock('redux');
jest.mock('react-redux');
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('message - MessageDetailForm - connect', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../MessageDetailForm').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            selectedMessageId: "123",
            param: { isGetAll: true }
        };
        const state = {
            selectedMessageId: "123",
            param: { isGetAll: true },
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
            getMessageDetail: actions['getMessageDetail'],
            fetchData: actions['fetchData'],
            insertMessage: actions['insertMessage'],
            updateMessage: actions['updateMessage'],
            toggleLoader: actions['toggleLoader'],
            deleteMessages: actions['deleteMessages']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const MessageDetailForm = require('../../MessageDetailForm').MessageDetailForm;

        expect(connectMock).toHaveBeenCalledWith(React.memo(MessageDetailForm));
    })
})