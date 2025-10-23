import { deviceTypes, pcLaptop, mobile } from '../../../../modules/constants';
import { globalResource } from '../../../../modules/globalResource';

export { deviceTypes, globalResource, pcLaptop, mobile };

export const defaultInsertId = 0;
export const messages = {
    NoFileChoosen: 'No file choosen',
    Files: 'files'
}
export const UserType = "userType";
export const allUserType = 0;
export const playerBanner = 1;
export const affiliateBanner = 2;

export const userTypeList = {
    [playerBanner]: 'Players',
    [affiliateBanner]: 'Sub-Affiliate'
}