import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setShowPopup, setAffNoteInfo, getAffNoteList, getAffNoteContentById, toggleLoaderUserPanel } from '../actions';
import { claimResource } from '../../../../../modules/claim';
import NoteContent from '../../common/components/NoteContent';

const mapStateToProps = ({ affCommonInfo, note, claimsPrincipal }) => {
    const { pagingOption, affNoteList, affNoteInfo } = note.affNote;
    const { affId } = affCommonInfo;
    const isEditNote = claimsPrincipal.hasWriteClaim(claimResource.Note);

    return Object.assign({}, {
        affId,
        pagingOption,
        isEditNote,
        noteList: affNoteList,
        noteInfo: affNoteInfo,
    });
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setShowPopup,
        toggleLoaderUserPanel,
        setNoteInfo: setAffNoteInfo,
        getNoteList: getAffNoteList,
        getNoteContentById: getAffNoteContentById
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteContent);