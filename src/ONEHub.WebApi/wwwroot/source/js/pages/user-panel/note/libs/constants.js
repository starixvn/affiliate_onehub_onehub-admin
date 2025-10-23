import { maxWidth } from '../../../../modules/constants';
import { globalResource } from '../../../../modules/globalResource';

export { globalResource, maxWidth }

export const maxLength = 1000;

export const headerText = {
    Index: globalResource.Index,
    Content: 'Content',
    CreatedBy: 'Created By',
    LastModify: 'Last Modify'
}

export const resource = {
    RequiredErrorMessage: 'This field is required',
    MaxLengthErrorMessage: 'This field must not exceed 1000 characters',
    AddNote: 'Add Note',
    AddNoteSuccess: 'Add Note is successful',
    UpdateNote: 'Update Note',
    UpdateNoteSuccess: 'Update Note is successful',
    Failed: 'The request is failed'
}

export const defaultNote = { noteId: 0, noteContent: '' };

export const menuKey = {
    affNote: 'affNote',
    marketingNote: 'marketingNote'
}