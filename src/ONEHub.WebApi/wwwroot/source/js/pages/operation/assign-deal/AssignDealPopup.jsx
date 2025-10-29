import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { resolveClientUrl } from '../../../modules/utils';
import { popupEventNames } from '../deal/libs/constants';

export default class AssignDealPopup extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.addEventListener('message', this.handleClosePopupEvent);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handleClosePopupEvent);
    }

    handleClosePopupEvent = (event) => {
        if (typeof event.data === 'string') {
            if (event.data === popupEventNames.assignDealSuccessfully) {
                this.handleAssignDealSuccessfully();
            }
        }
    }

    handleAssignDealSuccessfully = () => {
        this.props.getAffiliateInfo(this.props.affName);
        this.props.setShowPopupAssignDeal(false);
    }

    handleClosePopup = () => {
        this.props.setShowPopupAssignDeal(false);
    }

    render() {
        const { showPopupAssignDeal, affName, affId, isNewAffiliate } = this.props;

        const title = isNewAffiliate ? 'Assign Deal For New Affiliate' : `Change Deal For ${affName}`;

        const url = resolveClientUrl(`Portal/DealAssignment/AssignDeal?affId=${affId}`);
        const maxWidth = 650;

        return (
            <div className="data-content">
                <Modal isOpen={showPopupAssignDeal} toggle={this.handleClosePopup} backdrop='static' style={{ maxWidth }}>
                    <ModalHeader toggle={this.handleClosePopup}>
                        <span className="iconpopup"></span> {title}
                    </ModalHeader>
                    <ModalBody>
                        <div className="modal-body-wrapper embed-responsive embed-responsive-4by3" style={{ height: 310 }}>
                            <iframe className="embed-responsive-item" src={url}></iframe>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}