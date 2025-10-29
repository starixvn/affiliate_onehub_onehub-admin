import React, { useEffect, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import ViewDeal from './ViewDeal';

import { getDealDetail, setDealInfo } from '../deal/actions';

export const ViewDealPopup = (props) => {

    useEffect(() => {
        if (props.dealId) {
            props.getDealDetail(props.dealId);
        }
    }, [props.dealId]);

    const _handleHidePopup = () => {
        props.toggle();
        props.setDealInfo(null);
    }

    return props.dealInfo && (
        <Fragment>
            <Modal className="deal-popup-container" isOpen={!!props.dealInfo} toggle={_handleHidePopup} size="lg" backdrop='static'>
                <ModalHeader toggle={_handleHidePopup}><span className="iconpopup"></span>{`${props.affName} - ${props.dealInfo.DealName}`}</ModalHeader>
                <ModalBody className='disabled-all'>
                    <div className="modal-body-wrapper">
                        <ViewDeal
                            dealType={props.dealInfo.DealType}
                            onClose={_handleHidePopup}
                        />
                    </div>
                </ModalBody>
            </Modal>
        </Fragment>
    );
};

const mapStateToProps = ({ dealInfo }) => {
    return {
        dealInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getDealDetail,
        setDealInfo
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ViewDealPopup));