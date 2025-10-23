import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col, FormGroup, Label } from 'reactstrap';
import { targetCountryStatus } from '../../../modules/constants';
import { getBlockTargetCountryList } from '../modules/utils/targetcountry';

export default class BlockTargetCountryFormGroup extends PureComponent {
    constructor(props) {
        super(props);
    }

    _handleChangeTargetCountry = (event, targetCountryCode) => {
        const isChecked = event.target.checked;

        const { targetCountryList } = this.props;

        const newTargetCountryList = targetCountryList.map(item => {
            if (item.TargetCountryCode !== targetCountryCode) {
                return item;
            }
            return {
                ...item,
                Status: isChecked ? targetCountryStatus.Blocked : targetCountryStatus.Normal
            };
        });

        const blockTargetCountryList = getBlockTargetCountryList(newTargetCountryList);
        const isBlockAllTargetCountries = blockTargetCountryList.length === newTargetCountryList.length;

        this.props.changeTargetCountry(isBlockAllTargetCountries, blockTargetCountryList.join(','), newTargetCountryList);
    }

    _handleChangeAllTargetCountries = (event) => {
        const isChecked = event.target.checked;
        const { targetCountryList } = this.props;

        const status = isChecked ? targetCountryStatus.Blocked : targetCountryStatus.Normal;
        const newTargetCountryList = targetCountryList.map(item => {
            return {
                ...item,
                Status: status
            };
        });

        const blockTargetCountryList = getBlockTargetCountryList(newTargetCountryList);

        this.props.changeTargetCountry(isChecked, blockTargetCountryList.join(','), newTargetCountryList);
    }

    render() {
        const { lblText, targetCountryList, isBlockAllTargetCountries, sm } = this.props;

        return targetCountryList && (
            <FormGroup row>
                <Label sm={sm}>{lblText}</Label>
                <Col>
                    <div className="block-target-country">
                        {
                            targetCountryList.map(item => {
                                return (
                                    <div key={item.TargetCountryCode} className="block-target-country-item">
                                        <input type="checkbox" className="mr-2" id={item.TargetCountryCode} checked={item.Status === targetCountryStatus.Blocked} onChange={(e) => this._handleChangeTargetCountry(e, item.TargetCountryCode)} />
                                        <Label className="country-item" for={item.TargetCountryCode}>{item.TargetCountryName}</Label>
                                    </div>
                                )
                            })
                        }
                        <div className="block-target-country-item block-target-country-All">
                            <input type="checkbox" className="mr-2" id="All-Target-Countries" checked={isBlockAllTargetCountries} onChange={this._handleChangeAllTargetCountries} />
                            <Label for="All-Target-Countries">All</Label>
                        </div>
                    </div>
                </Col>
            </FormGroup>
        )
    }
}

BlockTargetCountryFormGroup.propTypes = {
    sm: PropTypes.number,
    targetCountryList: PropTypes.array.isRequired,
    isBlockAllTargetCountries: PropTypes.bool,
    changeTargetCountry: PropTypes.func.isRequired,
    lblText: PropTypes.string
};

BlockTargetCountryFormGroup.defaultProps = {
    sm: 3,
    targetCountryList: null,
    isBlockAllTargetCountries: false,
    lblText: 'Block Target Country'
};