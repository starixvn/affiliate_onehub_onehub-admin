import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { FormGroup, Label, Col, Input } from 'reactstrap';

import MultipleSelect from '../../../../../../../components/multiple-select';

import { setDealInfo } from '../../../../actions';
import { INFINITY_NUMBER } from '../../../../libs/constants';
import { format } from '../../../../../../../modules/numberFormat';
import { convertTargetCountryList } from '../../../../libs/service';
import { isValidNumber } from '../../../../../../../modules/utils';


export const Player = ({ dealInfo, targetCountryList, isSubmitted, setDealInfo, isModifiable }) => {

    const _handleChangeTargetCountry = (item, selectedTargetCountry) => {
        setDealInfo({ CountryCodes: selectedTargetCountry });
    }

    const _handleChangePositiveInteger = (e) => {
        const { name, value } = e.target;
        const numericValue = Number(value.replace(/,/g, ''));
        let newValue = dealInfo[name];

        if (value === '') {
            newValue = '';
        } else if (numericValue === 0) {
            newValue = 0;
        }
        else if (numericValue > 0 && numericValue <= INFINITY_NUMBER && isValidNumber(numericValue)) {
            newValue = numericValue;
        }

        setDealInfo({ [name]: newValue });
    };

    const _handleCheckMinPlayerHoldingPeriod = (e) => {
        const { name } = e.target;
        const toggledValue = !dealInfo[name];

        const updatedInfo = { [name]: toggledValue };

        if (toggledValue) {
            updatedInfo.HoldingDays = '';
            updatedInfo.HoldingTickets = '';
        } else {
            updatedInfo.HoldingDays = 0;
            updatedInfo.HoldingTickets = 0;
        }

        setDealInfo(updatedInfo);
    };

    const _getErrorClass = (value, checkedField = true) => {
        if (isSubmitted && checkedField) {
            return Number.isNaN(value) || value < 1 || value > INFINITY_NUMBER ? 'has-error' : '';
        }

        return '';
    }

    const _targetCountryList = convertTargetCountryList(targetCountryList, dealInfo.CountryCodes);

    return (
        <fieldset className="player-group">
            <legend><h6 className="font-weight-bold">Player</h6></legend>
            <FormGroup row inline className='align-items-center'>
                <Label htmlFor="CountryCodes" sm={4} className="mr_15neg">Player Target Country{' '}
                    <span className="text-danger required" style={{ margin: 0 }}>*</span>
                </Label>
                <Col id="CountryCodes" sm={3} className={`${isSubmitted && !dealInfo.CountryCodes ? 'is-invalid' : ''}`}>
                    <MultipleSelect
                        dataSource={_targetCountryList}
                        keyField="TargetCountryCode"
                        valueField="TargetCountryName"
                        statusField="Checked"
                        maxDisplayItemCount={1}
                        hasInputOption={false}
                        noneSelectedLabel="Please Select"
                        selectedAllLabel="All Target Countries"
                        onChange={_handleChangeTargetCountry} />
                </Col>
            </FormGroup>

            <FormGroup row className='align-items-center'>
                <Label htmlFor="ActiveDays" sm={4} className="mr_15neg">
                    Activity Period
                    <span className="text-danger required" style={{ marginLeft: 3 }}>*</span>
                    <span title="The player must complete all required actions within this time period to qualify. For example: within 30 days from registration." className="ml-1 oi icon-info"></span>
                </Label>
                <Col sm={3} className="d-flex align-items-center">
                    <Input type="text"
                        name="ActiveDays"
                        className={_getErrorClass(dealInfo.ActiveDays)}
                        id="ActiveDays"
                        value={format(dealInfo.ActiveDays)}
                        onChange={_handleChangePositiveInteger} />
                </Col>
                <Label className="text-content mb-0 ms-2">(days)</Label>
            </FormGroup>

            <FormGroup row className='align-items-center'>
                <Label sm={4} className="d-flex mr_15neg" htmlFor='IsActivePlayerHoldingPeriod'>
                    <input
                        disabled={!isModifiable}
                        type="checkbox"
                        name="IsActivePlayerHoldingPeriod"
                        id="IsActivePlayerHoldingPeriod"
                        className={_getErrorClass(dealInfo.HoldingTickets, dealInfo.IsActivePlayerHoldingPeriod)}
                        checked={dealInfo.IsActivePlayerHoldingPeriod}
                        onChange={_handleCheckMinPlayerHoldingPeriod}
                    />
                    <span className="ml-1">Minimum Player Holding Period</span>
                    <span title="After completing the activity period, the player must reach the required ticket amount within the holding period (e.g., 30 days)." className="ml-1 oi icon-info"></span>
                </Label>

                <Col sm={2} className="d-flex align-items-center">
                    <Input type="text"
                        disabled={!dealInfo.IsActivePlayerHoldingPeriod}
                        name="HoldingTickets"
                        className={_getErrorClass(dealInfo.HoldingTickets, dealInfo.IsActivePlayerHoldingPeriod)}
                        id="HoldingTickets"
                        value={format(dealInfo.HoldingTickets)}
                        onChange={_handleChangePositiveInteger} />
                </Col>
                <Label className="text-content mb-0 ms-2">(tickets) in</Label>
                <Col sm={2} className="d-flex align-items-center">
                    <Input type="text"
                        disabled={!dealInfo.IsActivePlayerHoldingPeriod}
                        name="HoldingDays"
                        className={_getErrorClass(dealInfo.HoldingDays, dealInfo.IsActivePlayerHoldingPeriod)}
                        id="HoldingDays"
                        value={format(dealInfo.HoldingDays)}
                        onChange={_handleChangePositiveInteger} />
                </Col>
                <Label className="text-content mb-0 ms-2">(days)</Label>
            </FormGroup>
        </fieldset>
    );
}

const mapStateToProps = ({ dealInfo, targetCountryList, isSubmitted, isModifiable }) => {
    return {
        targetCountryList,
        dealInfo,
        isSubmitted,
        isModifiable
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setDealInfo
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player));