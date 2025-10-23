import React from 'react';
import Loader from '../Loader';
import ShallowRenderer from 'react-test-renderer/shallow';

describe('Loader', () => {
    it('render - correctly with no props', () => {
        const renderer = new ShallowRenderer();

        const result = renderer.render(<Loader />);

        expect(result).toMatchSnapshot();
    });

    it('render - correctly with correct props', () => {
        const renderer = new ShallowRenderer();

        const result = renderer.render(<Loader backdrop={false} show={true} style={{ color: 'red' }} />);

        expect(result).toMatchSnapshot();
    });
});