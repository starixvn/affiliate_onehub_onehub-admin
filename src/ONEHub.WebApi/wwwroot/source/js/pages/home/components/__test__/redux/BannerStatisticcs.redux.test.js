jest.mock('redux');
jest.mock('react-redux');
import React from 'react';
import { connect } from 'react-redux';

describe('home - BannerStatistics - connect', () => {
    let mapStateToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            return connectMock;
        });
        require('../../BannerStatistics');
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            generalInfo: { PaymentReqNum: 1 },
        };
        const state = {
            generalInfo: { PaymentReqNum: 1 },
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const BannerStatistics = require('../../BannerStatistics').BannerStatistics;

        expect(connectMock).toHaveBeenCalledWith(React.memo(BannerStatistics));
    })
})