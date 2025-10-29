import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';

import Select from '../../../../components/select';
import MultipleSelect from '../../../../components/multiple-select';

import { insertDomain, updateDomain, toggleLoader, fetchData, setSelectedDomainId, getDomainControlById, fetchDomain } from '../actions/index';
import { defaultState, filterDealMode } from '../libs/constants';
import { handleChangeMultipleSelected } from '../../../../modules/utils';
import { _handleInitialDealList, _validateSelectedDealsByMode } from '../../../common/modules/utils/dealInfoFormat';

export class DomainControlPopup extends PureComponent {
    constructor(props) {
        super(props)

        this.state = defaultState;
    }

    componentDidUpdate(prevProps) {
        const { selectedDomainId } = this.props;
        if (selectedDomainId !== null && prevProps.selectedDomainId !== selectedDomainId) {
            this._handleUpdateState(selectedDomainId);
        }
    }

    _handleUpdateState = async (selectedDomainId) => {
        const { targetCountryList, dealList } = this.props;
        if (selectedDomainId === 0) {
            if (targetCountryList && targetCountryList.length) {
                const targetCountryCode = targetCountryList[0].TargetCountryCode;

                const { affDomainList, redirectDomainList } = await this.props.fetchDomain(targetCountryCode);
                const affDomainId = affDomainList[0].DomainId;
                const redirectDomainId = redirectDomainList[0].DomainId;

                this.setState({
                    isInsert: true,
                    selectedDomain: {
                        domainControlId: selectedDomainId,
                        affDomainId,
                        redirectDomainId,
                        targetCountryCode,
                        isUsed: true,
                        isExcluded: filterDealMode.Exclude,
                        dealIds: '',
                        isMobile: false
                    },
                    affDomainList,
                    redirectDomainList,
                    dealListMultipleSelected: _handleInitialDealList(dealList, '')
                });
            }
        } else {
            this.props.toggleLoader(true);
            const domain = await this.props.getDomainControlById(selectedDomainId);

            if (domain) {
                const { AffDomainId, RedirectDomainId, TargetCountryCode, IsUsed, IsExcluded, DealIds, IsMobile } = domain;
                const { affDomainList, redirectDomainList } = await this.props.fetchDomain(TargetCountryCode);

                const affDomainId = affDomainList.find(d => d.DomainId === AffDomainId)?.DomainId || affDomainList[0].DomainId;
                const redirectDomainId = redirectDomainList.find(d => d.DomainId === RedirectDomainId)?.DomainId || redirectDomainList[0].DomainId;

                const newDealList = _handleInitialDealList(dealList, DealIds);
                this.setState({
                    isInsert: false,
                    selectedDomain: {
                        domainControlId: selectedDomainId,
                        affDomainId,
                        redirectDomainId,
                        targetCountryCode: TargetCountryCode,
                        isUsed: IsUsed,
                        isExcluded: IsExcluded,
                        dealIds: DealIds,
                        isMobile: IsMobile
                    },
                    affDomainList,
                    redirectDomainList,
                    dealListMultipleSelected: newDealList
                });
            } else {
                this.props.setSelectedDomainId(null);
            }
            this.props.toggleLoader(false);
        }
    }

    _handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        const { selectedDomain } = this.state;

        const newDomain = Object.assign({}, selectedDomain, { [target.name]: value });

        this.setState({ selectedDomain: newDomain });
    }

    _handleChangeTargetCountry = async (event) => {
        this.props.toggleLoader(true);

        const { value } = event.target;

        const { affDomainId, redirectDomainId } = this.state.selectedDomain;
        const { affDomainList, redirectDomainList } = await this.props.fetchDomain(value);
        const newAffDomainId = affDomainList.find(d => d.DomainId === affDomainId)?.DomainId || affDomainList[0].DomainId;
        const newRedirectDomainId = redirectDomainList.find(d => d.DomainId === redirectDomainId)?.DomainId || redirectDomainList[0].DomainId;

        this.setState(prevState => ({
            selectedDomain: {
                ...prevState.selectedDomain,
                targetCountryCode: value,
                affDomainId: newAffDomainId,
                redirectDomainId: newRedirectDomainId
            },
            affDomainList,
            redirectDomainList
        }));

        this.props.toggleLoader(false);
    }

    _handleChangeAffDomain = (selectedDomainId) => {
        this._handleChangeDomain("affDomainId", selectedDomainId);
    }

    _handleChangeRedirectDomain = (selectedDomainId) => {
        this._handleChangeDomain("redirectDomainId", selectedDomainId);
    }

    _handleChangeDomain = (domainType, domainId) => {
        this.setState(prevState => ({ selectedDomain: { ...prevState.selectedDomain, [domainType]: domainId } }));
    }

    _handleChangeFilterDealMode = (event) => {
        const { value } = event.target;
        this.setState(prevState => ({
            selectedDomain: {
                ...prevState.selectedDomain,
                isExcluded: Number(value),
                dealIds: ''
            },
            dealListMultipleSelected: handleChangeMultipleSelected(prevState.dealListMultipleSelected, '')
        }));
    }

    _handleChangeDeals = (item, selectedDeals) => {
        const isAllDeals = selectedDeals.split(',').length === this.props.dealList.length;
        this.setState(prevState => ({
            selectedDomain: { ...prevState.selectedDomain, dealIds: isAllDeals ? '0' : selectedDeals },
            dealListMultipleSelected: handleChangeMultipleSelected(prevState.dealListMultipleSelected, selectedDeals)
        }));
    }

    _handleSubmit = async (isValid) => {
        this.props.toggleLoader(true);
        this.setState({ isClickedSubmit: true });

        if (isValid) {
            const { isInsert, selectedDomain } = this.state;
            const message = isInsert ? "Add Successfully!" : "Update Successfully!";

            const result = isInsert ? await this.props.insertDomain(selectedDomain) : await this.props.updateDomain(selectedDomain);
            if (result) {
                this._handleShowAlert(result.IsSuccessful, result.IsSuccessful ? message : result.Message);
            } else {
                this._handleShowAlert(false, isInsert ? "Add Domain is failed!" : "Update Domain is failed!");
            }
        }
        this.props.toggleLoader(false);
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
            this.props.fetchData(this.props.selectedTargetCountry, this.props.affSubDomainList, true);
            this._handleClosePopup();
        }
    }

    _handleClosePopup = () => {
        this.props.setSelectedDomainId(null);
        this.setState(defaultState);
    }

    render() {
        const { selectedDomainId, targetCountryList } = this.props;
        const { isInsert, isSuccess, isShowMessage, message, selectedDomain, affDomainList, redirectDomainList, dealListMultipleSelected, isClickedSubmit } = this.state;

        const isShowPopup = selectedDomainId !== null;
        const isDisabled = targetCountryList == null;
        const dealValidation = _validateSelectedDealsByMode(selectedDomain.isExcluded, selectedDomain.dealIds, filterDealMode);
        const isValid = dealValidation === '';
        const title = isInsert ? "Add New Domain Control" : "Edit Domain Control";
        const buttonLabel = isInsert ? "Add" : "Submit";

        return (
            <Modal isOpen={isShowPopup} toggle={this._handleClosePopup} backdrop='static'>
                <ModalHeader toggle={this._handleClosePopup}><span className="iconpopup"></span>{title}</ModalHeader>
                <ModalBody>
                    <div className="modal-body-wrapper">
                        <div className="domain-form-container">
                            <Alert color={isSuccess ? 'success' : 'danger'} isOpen={isShowMessage}>
                                <div dangerouslySetInnerHTML={{ __html: message }}></div>
                            </Alert>
                            <Form tag="form" className="mb-4" autoComplete="off">
                                <FormGroup row className="align-items-center mb-2">
                                    <Label htmlFor="targetCountryCode" sm={4}>Target Country</Label>
                                    <Col sm={8}>
                                        {
                                            isDisabled ? (
                                                <Input type="select" name="targetCountryCode" disabled="true" title="All target countries are blocked for these domains!" className="mt-1" value="">
                                                    <option key="targetCountryCode-none" value="">Please select!</option>
                                                </Input>
                                            ) : (
                                                <Input type="select" name="targetCountryCode" className="mt-1" value={selectedDomain.targetCountryCode} onChange={this._handleChangeTargetCountry}>
                                                    {
                                                        targetCountryList.map(item => {
                                                            return (<option key={`targetCountryCode-${item.TargetCountryCode}`} value={item.TargetCountryCode}>{item.TargetCountryName}</option>)
                                                        })
                                                    }
                                                </Input>
                                            )
                                        }
                                    </Col>
                                </FormGroup>
                                <FormGroup row className="align-items-center mb-2">
                                    <Label htmlFor="affDomainId" sm={4}>Aff Domain</Label>
                                    <Col sm={8}>
                                        <Select
                                            key={selectedDomain.affDomainId}
                                            id="affDomain"
                                            dataSource={affDomainList}
                                            keyField="DomainId"
                                            valueField="DomainName"
                                            hasInputOption={true}
                                            selectedKey={selectedDomain.affDomainId}
                                            onChange={this._handleChangeAffDomain} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row className="align-items-center mb-2">
                                    <Label htmlFor="redirectDomainId" sm={4}>Redirect Domain</Label>
                                    <Col sm={8}>
                                        <Select
                                            key={selectedDomain.redirectDomainId}
                                            id="redirectDomain"
                                            dataSource={redirectDomainList}
                                            keyField="DomainId"
                                            valueField="DomainName"
                                            hasInputOption={true}
                                            selectedKey={selectedDomain.redirectDomainId}
                                            onChange={this._handleChangeRedirectDomain} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row className="align-items-center mb-2">
                                    <Label sm={4}>Deal</Label>
                                    <Col sm={8}>
                                        <Input type="select" name="isExcluded" className='mt-1' value={Number(selectedDomain.isExcluded)} onChange={this._handleChangeFilterDealMode}>
                                            <option key="isExcluded-0" value={filterDealMode.Include}>Applied To</option>
                                            <option key="isExcluded-1" value={filterDealMode.Exclude}>Applied To All Deals Except</option>
                                        </Input>
                                    </Col>
                                </FormGroup>
                                <FormGroup row className="align-items-center mb-2">
                                    <Col sm={4}></Col>
                                    <Col sm={8} >
                                        <div className={`mt-1 ${dealValidation && isClickedSubmit ? 'is-invalid' : ''}`}>
                                            <MultipleSelect
                                                dataSource={dealListMultipleSelected}
                                                keyField="key"
                                                valueField="name"
                                                statusField="checked"
                                                noneSelectedLabel="None"
                                                selectedAllLabel="All Deals"
                                                hasInputOption={true}
                                                onChange={this._handleChangeDeals} />
                                        </div>
                                        {dealValidation && isClickedSubmit && <span className="text-danger">{dealValidation}</span>}
                                    </Col>
                                </FormGroup>
                                <FormGroup row className="align-items-center mb-2">
                                    <Col sm={4}></Col>
                                    <Label sm={3} className="d-flex mt-1">
                                        <input type="checkbox" name="isUsed" checked={selectedDomain.isUsed} onChange={this._handleChange} />
                                        <span className='ml-2'>Is Active</span>
                                    </Label>
                                    <Label sm={4} className="d-flex mt-1">
                                        <input type="checkbox" name="isMobile" checked={selectedDomain.isMobile} onChange={this._handleChange} />
                                        <span className='ml-2'>Is Mobile Only</span>
                                    </Label>
                                </FormGroup>
                            </Form>

                            <Button type="button" color="success" className="mr-3" onClick={() => this._handleSubmit(isValid)} disabled={isClickedSubmit ? !isValid : false}>{buttonLabel}</Button>
                            <Button type="button" color="info" onClick={this._handleClosePopup}>Cancel</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

function mapStateToProps({ selectedDomainId, selectedTargetCountry, targetCountryList, affSubDomainList, dealList }) {
    return Object.assign({}, { selectedDomainId, selectedTargetCountry, targetCountryList, affSubDomainList, dealList });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ insertDomain, updateDomain, toggleLoader, fetchData, setSelectedDomainId, getDomainControlById, fetchDomain }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DomainControlPopup);