import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';

import { globalResource } from '../../../../../modules/globalResource';
import { resolveClientUrl } from '../../../../../modules/utils';
import NotificationPopup from '../../../../common/components/NotificationPopup';

import { deleteDeal, fetchData } from '../../actions';
import { gridHeader } from '../../libs/constants';

export const GridData = (props) => {
    const { gridData } = props;

    const [selectedDealId, setSelectedDealId] = useState(0);
    const [shouldResetScrollPosition, setShouldResetScrollPosition] = useState(true);
    const [message, setMessage] = useState('');
    const [isConfirmPopup, setIsConfirmPopup] = useState(true);

    const _handleCloseNotificationPopup = (confirmResult) => {
        setMessage('');

        if (confirmResult && selectedDealId > 0) {
            _deleteDeal(selectedDealId);
        }
    }

    const _deleteDeal = async (dealId) => {
        const response = await props.deleteDeal(dealId);

        if (response && response.status === 200) {
            const data = response.data;

            if (data.IsSuccessful) {
                setMessage('Delete Deal Successfully.');
                await props.fetchData(props.param);
            } else {
                setMessage(data.Message);
            }
            setIsConfirmPopup(false);
            setShouldResetScrollPosition(true);
        }
    }

    const _handleDeleteDeal = (groupId, dealName) => {
        if (!props.isModifiable) {
            return;
        }

        setShouldResetScrollPosition(false);
        setSelectedDealId(groupId);
        setMessage(`Are you sure you want to delete the deal <strong>${dealName}</strong>? This action cannot be undone.`);
        setIsConfirmPopup(true);
    }

    const _renderNoData = () => (
        <Row>
            <Cell colSpan="8" className="text-center">{globalResource.NoInfo}</Cell>
        </Row>
    );

    const _renderHeader = () => {
        return (
            <Row key="theard">
                <Cell header={true} colWidth={20}>{gridHeader.RowNum}</Cell>
                <Cell header={true} colWidth={100}>{gridHeader.DealName}</Cell>
                <Cell header={true} colWidth={70}>{gridHeader.DealType}</Cell>
                <Cell header={true} colWidth={30}>{gridHeader.NoAff}</Cell>
                <Cell header={true} colWidth={120}>{gridHeader.Description}</Cell>
                <Cell header={true} colWidth={50}>{gridHeader.UpdatedBy}</Cell>
                <Cell header={true} colWidth={70}>{gridHeader.UpdatedDate}</Cell>
                <Cell header={true} colWidth={35}>{gridHeader.Action}</Cell>
            </Row>
        );
    }

    const _renderDataSection = () => {
        if (!gridData?.length) return _renderNoData();

        return gridData.map((item, index) => (
            <Row key={index}>
                <Cell title={item.RowNum} className="text-center">{item.RowNum}</Cell>
                <Cell title={item.DealName}>
                    <Button color="link" className="p-0" onClick={() => props.onEdit(item.GroupId)}>
                        {item.DealName}
                    </Button>
                </Cell>
                <Cell title={item.DealType} className="text-center">{item.DealType}</Cell>
                <Cell title={item.NoAff} className="text-center">
                    <a href={resolveClientUrl("Portal/Affiliate?groupId=") + item.GroupId} target="_top">{item.NoAff}</a>
                </Cell>
                <Cell title={item.Description}>{item.Description}</Cell>
                <Cell title={item.UpdatedBy} className="text-center">{item.UpdatedBy}</Cell>
                <Cell title={item.UpdatedDateStr} className="text-center">{item.UpdatedDateStr}</Cell>
                <Cell title={item.Action} className="text-center">
                    <button disabled={!props.isModifiable} title="Copy" className="btn btn-link" onClick={() => props.onCopy(item.GroupId)}>
                        <span className={`oi ${props.isModifiable ? 'icon-copy-link' : 'icon-copy-text'}`}></span>
                    </button>
                    <button disabled={!props.isModifiable || item.NoAff > 0} title="Delete" className="btn btn-link" onClick={() => _handleDeleteDeal(item.GroupId, item.DealName)}>
                        <span className={`oi ${props.isModifiable ? (item.NoAff > 0 ? 'oi-x text-secondary' : 'oi-x text-danger') : 'oi-x text-secondary'}`}></span>
                    </button>
                </Cell>
            </Row>
        ));
    }

    return (
        <React.Fragment>
            <div className="table-responsive table-striped">
                <Table
                    minWidth={1000}
                    autoWidth={true}
                    bodyHeight={300}
                    header={_renderHeader()}
                    body={_renderDataSection()}
                    containerPadding={20}
                    shouldResetScrollPosition={shouldResetScrollPosition}
                />
            </div>
            {
                !!message && <NotificationPopup
                    message={message}
                    isConfirmPopup={isConfirmPopup}
                    onClose={_handleCloseNotificationPopup}
                />
            }
        </React.Fragment>
    );
}

const mapStateToProps = ({ gridData, param, isModifiable }) => {
    return {
        gridData,
        param,
        isModifiable
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        deleteDeal,
        fetchData
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(GridData));