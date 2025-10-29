jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';
import { toggleLoader } from '../../../../../actions/loaderAction';

describe('affiliate info - GridData - connect', () => {
	let mapStateToProps, mapDispatchToProps;
	const connectMock = jest.fn();

	beforeAll(() => {
		connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
			mapStateToProps = mapStateToPropsFunc;
			mapDispatchToProps = mapDispatchToPropsFunc;
			return connectMock;
		});
		require('../../GridData').default;
	});

	it('props should be mapped correctly', () => {
		const expectedResult = {
			languageList: { en: 'English' },
			targetCountryList: { MY: 'Malaysia' },
			isShowMemberLink: true,
			pagingOption: { PageIndex: 1 },
			param: { abc: 123 },
			columnList: [1, 2, 3]
		};

		const state = {
			languageList: { en: 'English' },
			targetCountryList: { MY: 'Malaysia' },
			pagingOption: { PageIndex: 1 },
			param: { abc: 123 },
			columnList: [1, 2, 3],
			claimsPrincipal: { hasWriteClaim: jest.fn(() => true), hasReadClaim: jest.fn(() => true) },
			anotherProp: "Not included"
		};

		const result = mapStateToProps(state);

		expect(result).toEqual(expectedResult);
	})

	it('bindActionCreators should be called with correct parameter', () => {
		const mockBindAction = jest.fn();
		bindActionCreators.mockImplementationOnce(mockBindAction);
		const expectedActionCreator = {
			setPagingOption: actions['setPagingOption'],
			toggleLoader: toggleLoader,
			setShowPopupPassword: actions['setShowPopupPassword'],
			setShowPopupCommGroup: actions['setShowPopupCommGroup'],
			setAffId: actions['setAffId'],
			setParam: actions['setParam'],
			setParentAffName: actions['setParentAffName'],
			setCommGroup: actions['setCommGroup'],
		}

		const dispatch = {};
		mapDispatchToProps(dispatch);

		expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
	})

	it('returned function of connect should be called with correct parameter', () => {
		const GridData = require('../../GridData').GridData;

		expect(connectMock).toHaveBeenCalledWith(GridData);
	})
})