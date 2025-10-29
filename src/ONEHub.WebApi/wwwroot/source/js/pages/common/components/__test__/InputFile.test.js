import React from 'react';
import InputFile from '../InputFile';
import { shallow } from 'enzyme';

describe('common - components - InputFile ', () => {
    const defaultProps = {
        className: '',
        files: [{ name: 'abc.png' }],
        isMultiple: false,
        handleOnChangeFiles: jest.fn(),
        accept: 'image/jpg, image/gif, image/png, image/jpeg',
        btnName: 'Choose File',
        lblText: 'No file choosen'
    }

    it('render correctly', () => {
        const result = shallow(<InputFile {...defaultProps} />);

        expect(result).toMatchSnapshot();
    });

    it('render correctly with multiple files', () => {
        const props = { ...defaultProps, files: [{ name: 'abc.png' }, { name: 'xyz.png' }], isMultiple: true }
        const result = shallow(<InputFile {...props} />);

        expect(result).toMatchSnapshot();
    });

    it('componentDidUpdate - should call this.inputRef', () => {
        const props = { ...defaultProps, files: [] };
        const result = shallow(<InputFile {...props} />);
        const instance = result.instance();
        instance.inputRef.current = { value: 'abc' };

        instance.componentDidUpdate(defaultProps);

        expect(instance.inputRef.current.value).toEqual(null);
    });

    it('componentDidUpdate - should not call this.inputRef', () => {
        const result = shallow(<InputFile {...defaultProps} />);
        const instance = result.instance();
        instance.inputRef.current = { value: 'abc' };

        instance.componentDidUpdate(defaultProps);

        expect(instance.inputRef.current.value).toEqual('abc');
    });

    it('handleClick - should call this.inputRef', () => {
        const result = shallow(<InputFile {...defaultProps} />);
        const instance = result.instance();
        instance.inputRef.current = { value: 'abc', click: jest.fn() };

        result.find('div').simulate('click');

        expect(instance.inputRef.current.value).toEqual(null);
        expect(instance.inputRef.current.click).toHaveBeenCalled();
    });
})