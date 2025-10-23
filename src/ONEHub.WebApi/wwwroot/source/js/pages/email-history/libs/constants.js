import { minDate } from '../../../modules/constants';
import { globalResource } from '../../../modules/globalResource';

export { minDate, globalResource }

export const all = 0;
export const sender = 1;
export const email = 2;
export const affiliate = 3;
export const unknownAffiliate = 4

export const searchByList = {
    [all]: 'All',
    [sender]: 'Sender',
    [email]: 'Email',
    [affiliate]: 'Affiliate',
    [unknownAffiliate]: 'Unknown Affiliate',
}

export const resource = {
    Delete: 'Delete',
    EmailDetail: 'Email Detail',
    Subject: 'Subject:',
    SentDate: 'Sent Date:',
    From: 'From:',
    Content: 'Content:',
    SearchText: 'Search Text',
    AllDate: 'All Date',
}

export const headerText = {
    Index: globalResource.Index,
    Sender: 'Sender',
    Affiliate: 'Affiliate',
    Subject: 'Subject',
    EmailAddress: 'Email Address',
    SentDate: 'Sent Date',
}

export const messages = {
    PleaseSelect: 'Please select items to delete',
    AreYouSureDeleteEmails: 'Are you sure to delete the selected emails?',
    DeleteEmails: 'Delete Emails Successfully',
    AreYouSureDeleteEmail: 'Are you sure to delete the selected email?',
    DeleteEmail: 'Delete Email Successfully',
}