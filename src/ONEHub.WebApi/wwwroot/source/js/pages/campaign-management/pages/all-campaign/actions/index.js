import * as filterAction from './filterAction';
import * as gridAction from './gridAction';
import * as popupAction from './popupAction';
import { setPagingOption } from '@/actions/pagingAction';
import { toggleLoader } from '@/actions/loaderAction';

export const ActionCreators = {
    ...filterAction,
    ...gridAction,
    ...popupAction,
    setPagingOption,
    toggleLoader,
};