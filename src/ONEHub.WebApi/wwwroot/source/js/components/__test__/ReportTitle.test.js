import React from 'react';
import ReportTitle from '../ReportTitle';
import ShallowRenderer from 'react-test-renderer/shallow';

describe('ReportTitle', () => {
    it('render - content match with snapshot', () => {
        const renderer = new ShallowRenderer();

        const result = renderer.render(<ReportTitle content={'Report title'} />);

        expect(result).toMatchSnapshot();
    });
});