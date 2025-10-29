jest.mock('redux');
jest.mock('react-redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/index';
import { toggleLoader } from '../../../../../../actions/loaderAction';

describe('affiliate report - GridData - connect', () => {
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
			pagingOption: { PageIndex: 1 },
			param: { abc: 123 },
			currentViewLevel: 123
		};

		const state = {
			pagingOption: { PageIndex: 1 },
			param: { abc: 123 },
			currentViewLevel: 123,
			anotherProp: "Not included"
		};

		const result = mapStateToProps(state);

		expect(result).toEqual(expectedResult);
	})

	it('bindActionCreators should be called with correct parameter', () => {
		const mockBindAction = jest.fn();
		bindActionCreators.mockImplementationOnce(mockBindAction);
		const expectedActionCreator = {
			fetchData: actions['fetchData'],
			setPagingOption: actions['setPagingOption'],
			toggleLoader: toggleLoader,
			setViewLevel: actions['setViewLevel'],
			setParam: actions['setParam']
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