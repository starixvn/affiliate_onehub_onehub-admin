import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, Table } from 'reactstrap';
import { connect } from 'react-redux';

import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableFooter from './TableFooter';

import { setMemberCpaId } from '../../actions';
import { toggleLoader } from '../../../../../actions/loaderAction';
import { getTurnoverDetail } from '../../libs/service';
import { getMaxHeight } from '../../../libs/constants';

export const TurnoverDetail = ({ memberCpaId, setMemberCpaId, toggleLoader }) => {
    const [turnoverDetail, setTurnoverDetail] = useState(null);

    useEffect(() => {
        if (memberCpaId) {
            toggleLoader(true);
            getTurnoverDetail(memberCpaId)
                .then(data => {
                    setTurnoverDetail(data);
                })
                .catch(error => {
                    console.error(error);
                }).finally(() => {
                    toggleLoader(false);
                });
        }
    }, [memberCpaId]);

    if (!turnoverDetail) {
        return null;
    }

    const maxHeight = getMaxHeight()

    const closeModal = () => {
        setMemberCpaId(null)
        setTurnoverDetail(null)
    }

    return (
        <Modal
            className="turnover-detail-popup-container"
            isOpen={!!memberCpaId}
            toggle={closeModal}
            backdrop="static"
            size="md"
        >
            <ModalHeader
                toggle={closeModal}
                className="modal-header"
            >
                <h5 className="modal-title">
                    <span className="iconpopup"></span>
                    Turnover CPA Detail
                </h5>
            </ModalHeader>
            <ModalBody>
                <div className="modal-body-wrapper table-responsive" style={{ maxHeight }}>
                    <Table freeze-table bordered className="mb-0">
                        <TableHeader />
                        <TableBody groups={turnoverDetail.groups} />
                        <TableFooter total={turnoverDetail.total} />
                    </Table>
                </div>
            </ModalBody>
        </Modal>
    );
}

const mapStateToProps = (state) => {
    return {
        memberCpaId: state.memberCpaId
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setMemberCpaId: (data) => dispatch(setMemberCpaId(data)),
        toggleLoader: (data) => dispatch(toggleLoader(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(TurnoverDetail));