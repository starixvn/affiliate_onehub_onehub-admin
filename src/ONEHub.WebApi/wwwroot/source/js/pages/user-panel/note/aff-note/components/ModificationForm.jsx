import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setShowPopup, getAffNoteList, insertAffNote, updateAffNote } from '../actions';
import NoteModificationForm from '../../common/components/NoteModificationForm';

const mapStateToProps = ({ affCommonInfo, note }) => {
    const { pagingOption, affNoteInfo, isShowPopup } = note.affNote;
    const { affId } = affCommonInfo;

    return Object.assign({}, {
        affId,
        isShowPopup,
        pagingOption,
        noteInfo: affNoteInfo
    });
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setShowPopup,
        getNoteList: getAffNoteList,
        insertNote: insertAffNote,
        updateNote: updateAffNote
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteModificationForm);