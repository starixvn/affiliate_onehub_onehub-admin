import React from 'react'
import { AppContainer } from '../AppContainer'
import { shallow } from 'enzyme'

describe('player ggr report - component - AppContainer - ', () => {
    it('should render correctly', () => {
        const result = shallow(<AppContainer isShowLoader={false} />)

        expect(result).toMatchSnapshot();
    })
})