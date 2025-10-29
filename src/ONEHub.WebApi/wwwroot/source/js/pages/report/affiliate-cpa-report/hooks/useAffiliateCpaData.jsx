import { useEffect, useState } from 'react'
import { toggleLoader } from '../../../../actions/loaderAction';
import { setPagingOption, setReportTitle, toggleSubmit } from '../actions';
import { reportName, viewByOptions } from '../libs/constants';
import { fetchAffiliateCpaData } from '../libs/services';

export const useAffiliateCpaData = (isSubmit, params, dispatch) => {
    const [affiliateCpaData, setAffiliateCpaData] = useState(null);

    useEffect(() => {
        if (isSubmit) {
            fetchData();
        }
    }, [isSubmit]);

    const fetchData = () => {
        dispatch(toggleLoader(true));

        fetchAffiliateCpaData({ ...params, isExportExcel: false })
            .then(res => {
                dispatch(setPagingOption({
                    PageIndex: params.pageIndex,
                    PageSize: params.pageSize,
                    TotalItem: res?.totalItem
                }));
                setAffiliateCpaData(res);
                dispatch(setReportTitle(getTitle()));

            }).finally(() => {
                dispatch(toggleLoader(false));
                dispatch(toggleSubmit());
            });
    }

    const getTitle = () => {
        let title = reportName;
        if (params.viewBy) {
            title += ` - View By ${viewByOptions[+params.viewBy - 1].label}`;
        }
        title += ` - From ${params.fromDate} To ${params.toDate}`;

        return title;
    }

    return affiliateCpaData
};

export default useAffiliateCpaData;