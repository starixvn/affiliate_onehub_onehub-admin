import React from 'react';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { resizeWidthHeight } from '../../../modules/utils';

const maxWidthModal = 1108;

export const MediaReviewPopup = (props) => {

    const { mediaDetailUrl } = props;

    const _handleClosePopup = () => {
        props.setMediaDetailUrl({ src: null })
    }

    const resizeResult = mediaDetailUrl && resizeWidthHeight(mediaDetailUrl.width, mediaDetailUrl.height, maxWidthModal);

    return mediaDetailUrl && mediaDetailUrl.src && (
        <Modal isOpen={!!mediaDetailUrl.src} toggle={_handleClosePopup} size="xl" backdrop='static'>
            <ModalHeader toggle={_handleClosePopup}><span className="iconpopup"></span>{mediaDetailUrl.MediaId}</ModalHeader>
            <ModalBody>
                <div className="modal-body-wrapper embed-responsive overflow-auto text-center">
                    <img src={mediaDetailUrl.src} alt="Asset" width={resizeResult.width} height={resizeResult.height} />
                </div>
            </ModalBody>
        </Modal>
    );  
}

export default React.memo(MediaReviewPopup);