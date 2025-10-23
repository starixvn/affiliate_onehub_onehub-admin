import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Table } from 'reactstrap';
import { Pager } from '@9softstudio/react-fixed-table-header';
import TableHeader from './table/TableHeader';
import TableBody from './table/TableBody';
import TableFooter from './table/TableFooter';

import { toggleLoader } from '../../../../actions/loaderAction';
import { toggleSubmit, setPagingOption } from '../actions';
import { getRedepositCpaData } from '../libs/service';

export const GridData = ({ params, isSubmit, toggleLoader, toggleSubmit, setPagingOption, pagingOption }) => {
    const [data, setData] = useState(null);
    const [total, setTotal] = useState(null);

    useEffect(() => {
        if (isSubmit) {
            fetchData(params);
        }
    }, [isSubmit]);

    const fetchData = (params) => {
        toggleLoader(true);
        getRedepositCpaData(params)
            .then(data => {
                if (!!data) {
                    const { MainData, Total, TotalItem } = data;
                    setTotal(Total);
                    setPagingOption({
                        PageIndex: params.pageIndex,
                        PageSize: params.pageSize,
                        TotalItem: TotalItem
                    });
                    setData(MainData);
                }
            })
            .catch(err => {
                console.log('err: ', err);
            })
            .finally(() => {
                toggleLoader(false);
                toggleSubmit(false);
            })
    }

    const handlePaging = (index, size) => {
        const newPaging = {
            pageIndex: index,
            pageSize: size
        };
        const newParams = {
            ...params,
            ...newPaging
        };
        fetchData(newParams);
    }

    return data && (
        <React.Fragment>
            <div className="table-responsive aff-report-table-container">
                <Table className="freeze-table table-bordered table-hover" style={{ minWidth: '1500px' }}>
                    <TableHeader />
                    <TableBody data={data} />
                    <TableFooter total={total} totalItem={pagingOption.TotalItem} />
                </Table>
            </div>
            <Pager
                pageOption={pagingOption}
                onPaging={handlePaging} />
        </React.Fragment>
    )
};

const mapStateToProps = ({ params, isSubmit, pagingOption }) => {
    return {
        params,
        isSubmit,
        pagingOption,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        toggleLoader,
        toggleSubmit,
        setPagingOption
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(GridData));