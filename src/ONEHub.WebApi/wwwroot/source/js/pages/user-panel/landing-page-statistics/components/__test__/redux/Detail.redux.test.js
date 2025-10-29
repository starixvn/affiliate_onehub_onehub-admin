jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';

describe('landing page statistics - Detail - connect', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../Detail').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            param: { abc: 123 },
            pagingOption: { PageSize: 10 },
            selectedPage: 'abc'
        };
        const state = {
            landingPageStatistics: {
                param: { abc: 123 },
                pagingOption: { PageSize: 10 },
                selectedPage: 'abc'
            },
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            toggleLoaderUserPanel: actions['toggleLoaderUserPanel'],
            setPagingOption: actions['setPagingOption'],
            fetchDetailData: actions['fetchDetailData']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const Detail = require('../../Detail').Detail;

        expect(connectMock).toHaveBeenCalledWith(Detail);
    })
})