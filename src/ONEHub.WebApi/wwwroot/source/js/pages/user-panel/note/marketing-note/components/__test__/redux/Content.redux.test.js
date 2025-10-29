import React from 'react';
import { mount, shallow } from 'enzyme';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Content from '../../Content';
import NoteContent from '../../../../common/components/NoteContent';

jest.mock('../../../../common/components/NoteContent', () => 'mocked-NoteContent');

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initialState = {
    affCommonInfo: {
        affId: 1
    },
    note: {
        marketingNote: {
            pagingOption: {
                pageIndex: 1,
                pageSize: 10
            },
            marketingNoteList: [],
            marketingNoteInfo: {}
        }
    },
    claimsPrincipal: {
        hasWriteClaim: () => false
    }
};

describe('marketing-note - Content - connect', () => {
    it('renders without crashing', () => {
        const store = mockStore(initialState);
        const wrapper = shallow(<Content store={store} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render the container component', () => {
        const store = mockStore(initialState);

        const wrapper = mount(
            <Provider store={store}>
                <Content />
            </Provider>
        );

        const container = wrapper.find(Content);
        const content = container.find(NoteContent);

        expect(content.exists()).toBe(true);
        expect(content.props().affId).toBe(1);
        expect(content.props().pagingOption).toBe(initialState.note.marketingNote.pagingOption);
        expect(content.props().noteList).toBe(initialState.note.marketingNote.marketingNoteList);
        expect(content.props().noteInfo).toBe(initialState.note.marketingNote.marketingNoteInfo);
        expect(content.props().isEditNote).toBe(false);
    });
});