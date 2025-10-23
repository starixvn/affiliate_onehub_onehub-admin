import { minDate } from '../../../modules/constants';
import { globalResource } from '../../../modules/globalResource';

export { minDate };

export const all = '0';
export const normal = '1';
export const important = '2';
export const messageInsertId = 0;
export const messageCurrentId = -1;

const english = 'Message_en';
const chineseSimplified = 'Message_cs';
const thai = 'Message_th';
const vietNamese = 'Message_vn';
const indonesian = 'Message_id';
const korean = 'Message_ko';

export const defaultMessageContentList =
{
    MessageId: 0,
    [english]: '',
    [indonesian]: '',
    [korean]: '',
    [thai]: '',
    [vietNamese]: '',
    [chineseSimplified]: '',
};

export const languages = {
    [english]: 'English',
    [chineseSimplified]: 'Chinese Simplified',
    [thai]: 'Thai',
    [vietNamese]: 'VietNamese',
    [indonesian]: 'Indonesian',
    [korean]: 'Korean',
}

export const searchByList = {
    [all]: 'All',
    [normal]: 'Normal',
    [important]: 'Important'
}

export const resource = {
    CurrentMessage: 'Current Message',
    Select: 'Select:',
    None: 'None',
    AllDate: 'All Date',
    ViewDetail: 'View Detail',
    Add: globalResource.Add,
    All: globalResource.All,
    From: globalResource.From,
    To: globalResource.To,
    SearchBy: globalResource.SearchBy,
    Search: globalResource.Search,
    Edit: globalResource.Edit,
    Update: globalResource.Update,
    Delete: globalResource.Delete,
    Cancel: globalResource.Cancel,
    NoInfo: globalResource.NoInfo,
    Important: searchByList[important],
}

export const headerText = {
    Index: '#',
    Creator: 'Creator',
    PostedDate: 'Posted Date',
    Message: 'Message',
    Important: searchByList[important],
    UpdatedBy: 'Updated By',
    UpdatedDate: 'Updated Date'
}

export const messages = {
    PleaseSelect: 'Please select items to delete',
    AreYouSureDeleteItems: 'Are you sure to delete the selected message(s)?',
    DeleteItemsSuccessfully: 'Delete Message(s) Successfully',
    PleaseEnter: 'Please enter the content of message, one language at least.',
    AreYouWant: 'Are you sure you want to update this message?'
}

export const popupTitle = {
    Add: 'Add New Message',
    Current: 'Current Message Detail',
    Detail: 'Message Detail'
}