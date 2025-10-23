import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import Content from '../../Content'

describe('player ggr report - redux - Content - ', () => {
    it('should mapping to props correctly', () => {
        const initialState = {
            noMapping: '',
            reportTitle: 'title',
            param: {},
            productList: []
        }

        const mockStore = configureMockStore()
        const wrapper = shallow(<Content store={mockStore(initialState)} />).dive()

        const { reportTitle, param, productList, noMapping } = wrapper.props()

        expect(noMapping).toBeUndefined()
        expect(reportTitle).toEqual('title')
        expect(param).toEqual({})
        expect(productList).toEqual([])
    })
})