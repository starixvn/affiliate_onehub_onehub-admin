import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, Alert, FormFeedback } from 'reactstrap';

import MultipleSelect from '../../../../components/multiple-select';

import { setSelectedLandingPageId, getLandingPageDetail, fetchData, insertLandingPage, updateLandingPage, toggleLoader, getTargetCountryListByLandingPage } from '../actions/index';
import { defaultState, headerText, globalResource, messages, restrictedCharactersPattern, maxLength, filterDealMode } from '../libs/constants';
import { defaultInsertId } from '../../common/libs/constants';
import { getBlockTargetCountryList, _handleInitialTargetCountryList } from '../../../common/modules/utils/targetCountry';
import { htmlDecode } from '../../../../modules/htmlHelper';
import { handleChangeMultipleSelected } from '../../../../modules/utils';
import { _handleInitialDealList, _validateSelectedDealsByMode } from '../../../common/modules/utils/dealInfoFormat';

export class InsertUpdateForm extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            ...defaultState
        }
    }

    componentDidMount() {
        const { gridData } = this.props;

        !gridData && this.props.fetchData();
    }

    componentDidUpdate(prevProps) {
        const { selectedLandingPageId } = this.props;
        if (selectedLandingPageId !== null && prevProps.selectedLandingPageId !== selectedLandingPageId) {
            this.setState({ isInsert: selectedLandingPageId === defaultInsertId });

            this._handleUpdateState(selectedLandingPageId);
        }
    }

    _handleUpdateState = async (pageId) => {
        this.props.toggleLoader(true);

        const { dealList } = this.props;

        if (pageId === 0) {
            const visibleTargetCountryList = await this.props.getTargetCountryListByLandingPage({ pageId });

            this.setState({
                isInsert: true,
                selectedLandingPage:
                {
                    pageName: '',
                    pageCode: '',
                    blockTargetCountry: '',
                    isMobile: false,
                    isExcluded: filterDealMode.Exclude,
                    dealIds: '',
                    isDefault: false
                },
                dealListMultipleSelected: _handleInitialDealList(dealList, ''),
                targetCountryList: _handleInitialTargetCountryList(visibleTargetCountryList, '')
            });
        } else {
            const landingPage = await this.props.getLandingPageDetail(pageId);

            if (landingPage) {
                const pageName = htmlDecode(landingPage.PageName);
                const pageCode = htmlDecode(landingPage.PageCode);
                const dealIds = htmlDecode(landingPage.DealIds);
                const isMobile = landingPage.IsMobile;
                const isExcluded = landingPage.IsExcluded;
                const isDefault = landingPage.IsDefault;

                const targetCountryList = await this.props.getTargetCountryListByLandingPage({ pageId });

                const newDealList = _handleInitialDealList(dealList, dealIds);

                const selectedLandingPage = {
                    pageName,
                    pageCode,
                    isMobile,
                    isExcluded,
                    dealIds,
                    blockTargetCountry: '',
                    isDefault
                };

                const newState = {
                    isInsert: false,
                    selectedLandingPage,
                    dealListMultipleSelected: newDealList
                };

                if (targetCountryList?.length) {
                    const blockTargetCountryList = getBlockTargetCountryList(targetCountryList);
                    const blockTargetCountry = blockTargetCountryList.join(',');

                    const newTargetCountryList = _handleInitialTargetCountryList(targetCountryList, blockTargetCountry);

                    newState.selectedLandingPage.blockTargetCountry = blockTargetCountry;
                    newState.targetCountryList = newTargetCountryList;
                }

                this.setState(newState);
            }
        }

        this.props.toggleLoader(false);
    }

    _handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        const { selectedLandingPage } = this.state;
        const newPage = Object.assign({}, selectedLandingPage, { [target.name]: value });

        this.setState({ selectedLandingPage: newPage });
    }

    _handleChangeTargetCountry = (item, selectedTargetCountry) => {
        const { selectedLandingPage, targetCountryList } = this.state;
        const newPage = Object.assign({}, selectedLandingPage, { blockTargetCountry: selectedTargetCountry });
        const newTargetCountryList = handleChangeMultipleSelected(targetCountryList, selectedTargetCountry);

        this.setState({ selectedLandingPage: newPage, targetCountryList: newTargetCountryList });
    }

    _handleChangeFilterDealMode = (event) => {
        const { value } = event.target;
        this.setState({
            selectedLandingPage: {
                ...this.state.selectedLandingPage,
                isExcluded: Number(value),
                dealIds: ''
            },
            dealListMultipleSelected: handleChangeMultipleSelected(this.state.dealListMultipleSelected, '')
        });
    }

    _handleChangeDeals = (item, selectedDeals) => {
        const isAllDeals = selectedDeals.split(',').length === this.props.dealList.length;

        this.setState({
            selectedLandingPage: { ...this.state.selectedLandingPage, dealIds: isAllDeals ? '0' : selectedDeals },
            dealListMultipleSelected: handleChangeMultipleSelected(this.state.dealListMultipleSelected, selectedDeals)
        });
    }

    _validatePageCode() {
        const { pageCode } = this.state.selectedLandingPage;
        const hasRestrictedCharacter = restrictedCharactersPattern.test(pageCode);
        const result = {
            isValid: !!pageCode && !hasRestrictedCharacter && pageCode.length <= maxLength,
            message: ''
        }

        if (!result.isValid) {
            result.message = !pageCode ? messages.requiredErrorMessage :
                (hasRestrictedCharacter ?
                    'Special characters are not allowed' :
                    messages.maxLengthErrorMessage);
        }

        return result;
    }

    _validatePageName() {
        const { pageName } = this.state.selectedLandingPage;

        const result = {
            isValid: !!pageName && pageName.length <= maxLength,
            message: ''
        }

        if (!result.isValid) {
            result.message = !pageName ? messages.requiredErrorMessage : messages.maxLengthErrorMessage;
        }

        return result;
    }

    _handleSubmit = async (isValid) => {
        this.props.toggleLoader(true);
        this.setState({ isClickedSubmit: true });

        if (isValid) {
            const { selectedLandingPage, isInsert } = this.state;
            const { selectedLandingPageId } = this.props;
            const message = isInsert ? "Add Successfully!" : "Update Successfully!";
            const landingPageInfo = Object.assign({}, { pageId: selectedLandingPageId, ...selectedLandingPage });
            const result = isInsert ? await this.props.insertLandingPage(landingPageInfo) : await this.props.updateLandingPage(landingPageInfo);

            if (result) {
                this._handleShowAlert(result.IsSuccessful, result.IsSuccessful ? message : result.Message);
            } else {
                this._handleShowAlert(false, isInsert ? "Add Failed!" : "Update Failed!");
            }
        }

        this.props.toggleLoader(false);
    }

    _handleKeyPress = (event, isValid) => {
        if (event.charCode === 13) {
            event.preventDefault();
            this._handleSubmit(isValid);
        }
    }

    _handleShowAlert = (isSuccess, message) => {
        this.setState({
            message,
            isSuccess,
            isShowMessage: true,
        }, () => window.setTimeout(() => this._hideMessage(isSuccess), 3000));
    }

    _hideMessage = (isSuccess) => {
        this.setState({
            isShowMessage: false
        });

        if (isSuccess) {
            this.props.fetchData();
            this._handleClosePopup();
        }
    }

    _handleClosePopup = () => {
        this.props.setSelectedLandingPageId(null);

        this.setState({ ...defaultState });
    }

    render() {
        const { selectedLandingPage, isShowMessage, isSuccess, message, isInsert, isClickedSubmit, targetCountryList, dealListMultipleSelected } = this.state;
        const { pageCode, pageName, isDefault, isMobile, isExcluded, dealIds } = selectedLandingPage;
        const pageNameValidation = this._validatePageName();
        const pageCodeValidation = this._validatePageCode();
        const dealValidation = _validateSelectedDealsByMode(isExcluded, dealIds, filterDealMode);
        const isValid = pageNameValidation.isValid && pageCodeValidation.isValid && dealValidation === '';
        const isShowPopup = this.props.selectedLandingPageId !== null;
        const title = isInsert ? "Add Landing Page" : "Edit Landing Page";

        return (
            <Modal isOpen={isShowPopup} toggle={this._handleClosePopup} backdrop="static" style={{ maxWidth: 550 }}>
                <ModalHeader toggle={this._handleClosePopup}><span className="iconpopup"></span>{title}</ModalHeader>
                <ModalBody>
                    <div className="modal-body-wrapper">
                        <div className="landing-page-form-container">
                            <Alert color={isSuccess ? 'success' : 'danger'} isOpen={isShowMessage}>
                                <div dangerouslySetInnerHTML={{ __html: message }}></div>
                            </Alert>
                            <Form tag="form" className="mb-2" autoComplete="off">
                                <FormGroup row className="mb-2">
                                    <Label for="pageName" sm={4}>
                                        {headerText.LandingPageName}
                                        <span className="text-danger required ml-1">*</span>
                                        <span title={headerText.ShowInDropdown} className="oi icon-info ml-1"></span>
                                    </Label>
                                    <Col sm={8}>
                                        <Input type="text" name="pageName" className="input-required mt-2" value={pageName} onChange={this._handleChange}
                                            onKeyPress={(e) => this._handleKeyPress(e, isValid)} invalid={isClickedSubmit && !pageNameValidation.isValid} />
                                        {pageNameValidation.message &&
                                            <FormFeedback><div dangerouslySetInnerHTML={{ __html: pageNameValidation.message }} /></FormFeedback>}
                                    </Col>
                                </FormGroup>
                                <FormGroup row className="mb-2">
                                    <Label for="pageCode" sm={4}>
                                        {headerText.LandingPageCode}
                                        <span className="text-danger required ml-1">*</span>
                                        <span title={headerText.ContainInLinks} className="oi icon-info ml-1"></span>
                                    </Label>
                                    <Col sm={8}>
                                        <Input type="text" name="pageCode" className="input-required mt-2" value={pageCode} onChange={this._handleChange}
                                            onKeyPress={(e) => this._handleKeyPress(e, isValid)} invalid={isClickedSubmit && !pageCodeValidation.isValid} />
                                        {pageCodeValidation.message &&
                                            <FormFeedback><div dangerouslySetInnerHTML={{ __html: pageCodeValidation.message }} /></FormFeedback>}
                                    </Col>
                                </FormGroup>
                                <FormGroup row className="align-items-center mb-2">
                                    <Label sm={4}>Deal</Label>
                                    <Col sm={8}>
                                        <Input disabled={isDefault} type="select" name="isExcluded" className='mt-2' value={Number(isExcluded)} onChange={isDefault ? null : this._handleChangeFilterDealMode}>
                                            <option key="isExcluded-0" value={filterDealMode.Include}>Applied To</option>
                                            <option key="isExcluded-1" value={filterDealMode.Exclude}>Applied To All Deals Except</option>
                                        </Input>
                                    </Col>
                                </FormGroup>
                                <FormGroup row className="align-items-center mb-2">
                                    <Col sm={4}></Col>
                                    <Col sm={8} >
                                        <div className={`mt-2 ${dealValidation && isClickedSubmit ? 'is-invalid' : ''}`}>
                                            <MultipleSelect
                                                dataSource={dealListMultipleSelected}
                                                keyField="key"
                                                valueField="name"
                                                statusField="checked"
                                                noneSelectedLabel="None"
                                                selectedAllLabel="All Deals"
                                                hasInputOption={true}
                                                isDisable={isDefault}
                                                onChange={isDefault ? null : this._handleChangeDeals} />
                                        </div>
                                        {dealValidation && isClickedSubmit && <span className="text-danger">{dealValidation}</span>}
                                    </Col>
                                </FormGroup>
                                {
                                    targetCountryList && <FormGroup row className="align-items-center mb-2">
                                        <Label sm={4}>Block Target Country</Label>
                                        <Col sm={8}>
                                            <div className='mt-2'>
                                                <MultipleSelect
                                                    dataSource={targetCountryList}
                                                    keyField="key"
                                                    valueField="name"
                                                    statusField="checked"
                                                    noneSelectedLabel="None"
                                                    selectedAllLabel="All Target Countries"
                                                    hasInputOption={false}
                                                    isDisable={isDefault}
                                                    onChange={isDefault ? null : this._handleChangeTargetCountry} />
                                            </div>
                                        </Col>
                                    </FormGroup>
                                }
                                <FormGroup row className="align-items-center mb-2">
                                    <Col sm={4}></Col>
                                    <Label sm={4} className="d-flex mt-1">
                                        <input type="checkbox" name="isMobile" disabled={isDefault} checked={isMobile} onChange={isDefault ? null : this._handleChange} />
                                        <span className='ml-2'>Is Mobile Only</span>
                                    </Label>
                                </FormGroup>
                            </Form>

                            <Button type="button" color="success" className="mr-3" disabled={isClickedSubmit ? !isValid : false} onClick={() => this._handleSubmit(isValid)} >Submit</Button>
                            <Button type="button" color="info" onClick={this._handleClosePopup}>{globalResource.Cancel}</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

function mapStateToProps({ selectedLandingPageId, dealList }) {
    return Object.assign({}, { selectedLandingPageId, dealList });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedLandingPageId, getLandingPageDetail, fetchData, insertLandingPage, updateLandingPage, toggleLoader, getTargetCountryListByLandingPage }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(InsertUpdateForm);