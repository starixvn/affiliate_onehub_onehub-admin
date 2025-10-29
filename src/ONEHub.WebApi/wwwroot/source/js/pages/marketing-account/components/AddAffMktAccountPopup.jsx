import React, { useRef } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Button, Form, Alert } from 'reactstrap';

import GeneralInfo from './sections/GeneralInfo';
import Personal from './sections/Personal';
import Additional from './sections/Additional';
import EmailFormat from './sections/EmailFormat';
import Payment from './sections/Payment';
import WebSite from './sections/WebSite';

import { getMarketingAccountInfo, getPaymentMethod, setIsShowAddAffMktAccountPopup, setParam } from '../actions';
import { toggleLoader } from './../../../actions/loaderAction';
import useNewMarketingAccountData from '../hooks/useNewMarketingAccountData';

export const AddAffMktAccountPopup = ({ 
    aff, 
    isShowAddAffMktAccountPopup, 
    toggle, 
    toggleLoader, 
    setIsShowAddAffMktAccountPopup,
    params, setParam
}) => {
    const modalBodyRef = useRef();
    
    const {
        resultInfo,
        generalInfo, 
        setGeneralInfo, 
        personalInfo, 
        setPersonalInfo, 
        additionalInfo, 
        setAdditionalInfo, 
        paymentInfo, 
        setPaymentInfo, 
        websiteInfo, 
        setWebsiteInfo,
        handleSubmit,
        minimumPayment,
        paymentMethods
    } = useNewMarketingAccountData(aff.affId, toggleLoader);

    if(!generalInfo.hasData) {
        return null;
    }

    const onSave = () => {
        const onCloseModal = () => {
            setTimeout(() => {
                // reload grid data
                setParam({
                    ...params,
                });
                setIsShowAddAffMktAccountPopup(false);
            }, 3000);
        }
        handleSubmit(modalBodyRef, onCloseModal);
    }

    return (
        <Modal 
            isOpen={isShowAddAffMktAccountPopup} 
            toggle={toggle} 
            size="lg" 
            backdrop="static"
            innerRef={modalBodyRef}
            style={{ transform: 'translate(0, 0)' }}
        >
            <ModalHeader toggle={toggle}>
                <span className="iconpopup"></span> Add a new Marketing account
            </ModalHeader>
            <ModalBody>
                <div className="modal-body-wrapper">
                    <Alert color={resultInfo.isSuccess ? 'success' : 'danger'} isOpen={resultInfo.isShowMessage}>
                        <div dangerouslySetInnerHTML={{ __html: resultInfo.message }}></div>
                    </Alert>
                    <GeneralInfo generalInfo={generalInfo} setGeneralInfo={setGeneralInfo} />
                    <Personal personalInfo={personalInfo} setPersonalInfo={setPersonalInfo} />
                    <Additional additionalInfo={additionalInfo} setAdditionalInfo={setAdditionalInfo}/>
                    <EmailFormat generalInfo={generalInfo} setGeneralInfo={setGeneralInfo} />
                    <WebSite
                        websiteInfo={websiteInfo}
                        setWebsiteInfo={setWebsiteInfo}
                    />
                    <Payment
                        paymentInfo={paymentInfo}
                        setPaymentInfo={setPaymentInfo}
                        minimumPayment={minimumPayment}
                        paymentMethods={paymentMethods}
                    />
                    <Form tag="div">
                        <Button className="mb-3" color="success" onClick={onSave}>SAVE</Button>
                    </Form>
                </div>
            </ModalBody>
        </Modal>
    );
};

const mapStateToProps = ({ aff, isShowAddAffMktAccountPopup, params }) => {
    return {
        aff,
        isShowAddAffMktAccountPopup,
        params
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        toggleLoader,
        getMarketingAccountInfo,
        getPaymentMethod,
        setIsShowAddAffMktAccountPopup,
        setParam
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AddAffMktAccountPopup));