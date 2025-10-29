jest.mock('redux');
jest.mock('react-redux');
import React from 'react';
import { connect } from 'react-redux';

describe('left panel - ContactApp - connect', () => {
    let mapStateToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            return connectMock;
        });
        require('../../ContactApp').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            affiliateInfo: { AffId: 1271808 }
        };

        const state = {
            leftPanel: { affiliateInfo: { AffId: 1271808 } },
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const ContactApp = require('../../ContactApp').ContactApp;

        expect(connectMock).toHaveBeenCalledWith(React.memo(ContactApp));
    })
})