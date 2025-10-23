import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setShowPopup, getMarketingNoteList, insertMarketingNote, updateMarketingNote } from '../actions';
import NoteModificationForm from '../../common/components/NoteModificationForm';

const mapStateToProps = ({ affCommonInfo, note }) => {
    const { pagingOption, marketingNoteInfo, isShowPopup } = note.marketingNote;
    const { affId } = affCommonInfo;

    return Object.assign({}, {
        affId,
        isShowPopup,
        pagingOption,
        noteInfo: marketingNoteInfo
    });
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setShowPopup,
        getNoteList: getMarketingNoteList,
        insertNote: insertMarketingNote,
        updateNote: updateMarketingNote
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteModificationForm);