import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setShowPopup, setMarketingNoteInfo, getMarketingNoteList, getMarketingNoteContentById, toggleLoaderUserPanel } from '../actions';
import { claimResource } from '../../../../../modules/claim';
import NoteContent from '../../common/components/NoteContent';

const mapStateToProps = ({ affCommonInfo, note, claimsPrincipal }) => {
    const { pagingOption, marketingNoteList, marketingNoteInfo } = note.marketingNote;
    const { affId } = affCommonInfo;
    const isEditNote = claimsPrincipal.hasWriteClaim(claimResource.MarketingTeamNote);

    return Object.assign({}, {
        affId,
        pagingOption,
        isEditNote,
        noteList: marketingNoteList,
        noteInfo: marketingNoteInfo,
    });
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setShowPopup,
        toggleLoaderUserPanel,
        setNoteInfo: setMarketingNoteInfo,
        getNoteList: getMarketingNoteList,
        getNoteContentById: getMarketingNoteContentById
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteContent);