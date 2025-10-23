import React from 'react';
import { shallow } from 'enzyme';
import SortingCell from '../SortingCell';

describe('players detail - components - SortingCell', () => {
    it('render correctly with sort ASC', () => {
        const props = {
            isSortAsc: true,
            sortingColumn: 'Turnover',
            columnName: 'Turnover',
            title: 'Turnover',
            handleClickHeader: jest.fn()
        }

        const result = shallow(<SortingCell {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with sort DESC', () => {
        const props = {
            isSortAsc: false,
            sortingColumn: 'Turnover',
            columnName: 'Turnover',
            title: 'Turnover',
            handleClickHeader: jest.fn()
        }

        const result = shallow(<SortingCell {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('handleClickHeader should be called when click button', () => {
        const props = {
            isSortAsc: false,
            sortingColumn: 'Turnover',
            columnName: 'Turnover',
            title: 'Turnover',
            handleClickHeader: jest.fn()
        }

        const result = shallow(<SortingCell {...props} />);

        result.find('Button').simulate('click');

        expect(props.handleClickHeader).toHaveBeenCalledWith('Turnover');
    });
});