import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormGroup, Label, Col, Input } from 'reactstrap';

import { setDealInfo } from '../../actions';
import { htmlDecode } from '../../../../../modules/htmlHelper';
import { buildDefaultDealInfo } from '../../libs/service';

const MAX_LENGTH = 100;

export const DealInfo = (props) => {

    const { isEdit, isSubmitted, DealName, DealType, Description, dealTypeList, GroupId, targetCountryList } = props;

    const _handleChangeText = (e) => {
        const { name, value } = e.target;
        const trimmedValue = value.trim();
        if (trimmedValue.length <= MAX_LENGTH) {
            props.setDealInfo({ [name]: value });
        }
    }

    const _handleChangeDealType = (e) => {
        if (!!GroupId && GroupId > 0 || isEdit) {
            return;
        }

        const { value } = e.target;
        var dealType = Number(value);

        const { deductionList, productList } = props;
        const newDealInfo = buildDefaultDealInfo(targetCountryList, DealName, dealType, deductionList, productList);
        props.setDealInfo(newDealInfo);
    }

    return (
        <div>
            <FormGroup row className='align-items-center'>
                <Label htmlFor="DealNamePopup" sm={2}>Deal Name <span className="text-danger required" style={{ margin: 0 }}>*</span> </Label>
                <Col sm={8}>
                    <Input type="text"
                        className={isSubmitted && !DealName?.trim() ? 'has-error' : ''}
                        name="DealName"
                        id="DealNamePopup"
                        value={htmlDecode(DealName)}
                        onChange={_handleChangeText} />
                </Col>
                <Col sm={2}>
                </Col>
            </FormGroup>
            <FormGroup row className='align-items-center'>
                <Label htmlFor="DealTypePopup" sm={2}>Deal Type</Label>
                <Col sm={8}>
                    <Input type="select"
                        className="mr-sm-2 search-box"
                        name="DealType"
                        id="DealTypePopup"
                        disabled={!!GroupId && GroupId > 0 || isEdit}
                        value={DealType}
                        onChange={_handleChangeDealType}>
                        {dealTypeList.map((item, index) => (
                            <option key={index} value={item.GroupTypeId}>{item.GroupTypeName}</option>
                        ))}
                    </Input>
                </Col>
                <Col sm={2}>
                </Col>
            </FormGroup>
            <FormGroup row className='align-items-center'>
                <Label htmlFor="Description" sm={2}>Description </Label>
                <Col sm={8}>
                    <Input type="text"
                        name="Description"
                        id="Description"
                        value={htmlDecode(Description)}
                        onChange={_handleChangeText} />
                </Col>
                <Col sm={2}>
                </Col>
            </FormGroup>
        </div>
    )
}

const mapStateToProps = ({ dealInfo, dealTypeList, deductionList, productList, targetCountryList, isEdit, isSubmitted }) => {
    const { GroupId, DealName, DealType, Description, RevenueTierSetting } = dealInfo;
    return {
        GroupId,
        DealName,
        DealType,
        Description,
        RevenueTierSetting,
        dealTypeList,
        deductionList,
        productList,
        isEdit,
        isSubmitted,
        targetCountryList
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setDealInfo
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(DealInfo));