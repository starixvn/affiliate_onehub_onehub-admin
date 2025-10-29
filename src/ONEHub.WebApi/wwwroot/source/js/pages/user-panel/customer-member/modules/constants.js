import { maxWidth, minDate } from '../../../../modules/constants';
import { globalResource } from '../../../../modules/globalResource';

export { maxWidth, minDate }

export const memberTypes = {
    1: 'Non-Deposited',
    2: 'Deposited'
}

export const resource = {
    ...globalResource,
    Member: 'Player',
    UserName: 'User Name',
    FirstName: 'First Name',
    LastName: 'Last Name',
    EmailAddress: 'Email Address',
    Currency: 'Currency',
    RegisterDate: 'Registration Date'
}