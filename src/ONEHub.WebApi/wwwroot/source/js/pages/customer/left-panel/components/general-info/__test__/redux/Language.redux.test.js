jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../../actions/index';

describe('left panel - Language - connect', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../../Language').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            affName: '12BETAFF226',
            affiliateInfo: { AffId: 1271808 },
            languageList: { 'en-US': 'English' }
        };

        const state = {
            affCommonInfo: { affName: '12BETAFF226' },
            leftPanel: { affiliateInfo: { AffId: 1271808 } },
            languageList: { 'en-US': 'English' },
            anotherProp: "Not included"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            getAffiliateInfo: actions['getAffiliateInfo'],
            updateLanguage: actions['updateLanguage']
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const Language = require('../../Language').Language;

        expect(connectMock).toHaveBeenCalledWith(Language);
    })
})