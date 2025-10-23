jest.mock('redux');
jest.mock('react-redux');
import React from 'react';
import { connect } from 'react-redux';

describe('home - AffiliateStatistics - connect', () => {
    let mapStateToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            return connectMock;
        });
        require('../../AffiliateStatistics');
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
        const AffiliateStatistics = require('../../AffiliateStatistics').AffiliateStatistics;

        expect(connectMock).toHaveBeenCalledWith(React.memo(AffiliateStatistics));
    })
})