import React from 'react'
import { AppContainer } from '../AppContainer'
import { shallow } from 'enzyme'

describe('transfer report - component - AppContainer - ', () => {
    it('should render correctly', () => {
        const result = shallow(<AppContainer isShowLoader={false} />)

        expect(result).toMatchSnapshot();
    })
})