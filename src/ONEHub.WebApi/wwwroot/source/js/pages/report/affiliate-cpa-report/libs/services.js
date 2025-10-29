import { post } from '../../../../modules/ajaxRequest';

export const fetchAffiliateCpaData = async (params, isExportExcel = false) => {
    const url = 'Portal/AffiliateCpaReport/GetData';

    if(isExportExcel) {
        params.isExportExcel = true;
    }

    const response = await post(url, params);

    return response && response.status === 200 ? response.data : null;
}