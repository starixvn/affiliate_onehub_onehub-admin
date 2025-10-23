import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import { Pager } from '@9softstudio/react-fixed-table-header';
import { setParams, toggleSubmit } from '../actions';
import { getMaxHeight } from '../../libs/constants';
import useAffiliateCpaData from '../hooks/useAffiliateCpaData';
import TableHeader from './table/TableHeader';
import TableBody from './table/TableBody';
import TableFooter from './table/TableFooter';

const GridData = ({
    params,
    pagingOption,
    dispatch,
    isSubmit
}) => {
    const affiliateCpaData = useAffiliateCpaData(isSubmit, params, dispatch);
    const { mainData, total, totalItem } = affiliateCpaData || { mainData: [], total: null, totalItem: null };

    const handlePaging = (pageIndex, pageSize) => {
        dispatch(setParams({ ...params, pageIndex: pageIndex, pageSize: pageSize }));
        dispatch(toggleSubmit());
    }

    const maxHeight = getMaxHeight();

    if (!affiliateCpaData) {
        return null;
    }

    return (
        <Fragment>
            <div className="table-responsive" style={{ maxHeight }}>
                <Table className="freeze-table table-bordered table-hover">
                    <TableHeader
                        sortType={params.sortType}
                        sortDirectionType={params.sortDirectionType}
                    />
                    <TableBody
                        data={mainData}
                        pagingOption={pagingOption}
                    />
                    <TableFooter
                        total={total}
                        totalItem={totalItem}
                    />
                </Table>
            </div>
            <Pager
                pageOption={pagingOption}
                onPaging={handlePaging} />
        </Fragment>
    );
};

function mapStateToProps({ pagingOption, params, isSubmit }) {
    return { pagingOption, params, isSubmit };
}

export default connect(mapStateToProps)(React.memo(GridData));