import { maxWidth, deviceTypesHasAll as deviceTypes, minDate } from '../../../../modules/constants';
import { headerText } from '../../referrers/modules/constants';
import { globalResource } from '../../../../modules/globalResource';

export { globalResource, deviceTypes, maxWidth, minDate }

export const AllDevices = -1;

export const headerTitle = {
    Page: 'Page',
    Language: 'Language',
    ...headerText
}
