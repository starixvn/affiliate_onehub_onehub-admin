jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';

describe('home - MemberStatistics - connect', () => {
    let mapStateToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            return connectMock;
        });
        require('../../MemberStatistics').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            generalInfo: { PaymentReqNum: 1 }
        };

        const state = {
            generalInfo: { PaymentReqNum: 1 },
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const MemberStatistics = require('../../MemberStatistics').MemberStatistics;

        expect(connectMock).toHaveBeenCalledWith(MemberStatistics);
    })
})