import React from "react";
import TierSetting from './TierSetting';
import MultipleSelect from "../../../../../../../components/multiple-select";
import { Col, Form, FormGroup, Label } from 'reactstrap';
import DeductedPercentageForm from './DeductedPercentageGroup';
import { ONLY_ONE_ITEM, GGR, commissionValueList } from '../../../../libs/revenue-share-constants';

export default class PlatformFeeItem extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    handleChange = (selectedItem) => {
        selectedItem && this.props.onSelectProduct(selectedItem);
    }

    handleChangeComm = (event, propName) => {
        const { name, value } = event.target;
        this.props.onChangeCommission({ [name]: Number(value) }, propName);
    }

    render() {
        const { data, handleClick, isOnlyOnePlatformFeeRow, isFirst, index } = this.props;

        const { productList, royaltyFee, groupProductId } = data;
        const isValid = (isFirst && isOnlyOnePlatformFeeRow) || productList.filter(p => !p.Checked).length < productList.length;
        const isDisableAddButton = isFirst && (productList.length === ONLY_ONE_ITEM);
        const btnText = isFirst ? "Add +" : (<span className="oi oi-trash text-secondary"></span>);

        return (
            <div className="my-2">
                <FormGroup row className="align-items-center my-2">
                    <Col sm={3}>
                        <span className="group-index">{index}.</span>
                        <div className={`select-product ${isValid ? "" : "is-invalid"}`}>
                            <MultipleSelect
                                dataSource={productList}
                                keyField="ProductId"
                                valueField="ProductName"
                                statusField="Checked"
                                hasAllOption={false}
                                hasInputOption={!isOnlyOnePlatformFeeRow}
                                maxDisplayItemCount={1}
                                noneSelectedLabel={isValid ? "None" : "Please Select"}
                                onChange={this.handleChange}
                                isDisable={isOnlyOnePlatformFeeRow} />
                        </div>
                    </Col>
                    <Col sm={5} className="pl-0">
                        <Form inline>
                            <Label className="font-weight-bold pr-2">Royalty Fee:</Label>
                            <DeductedPercentageForm
                                value={royaltyFee}
                                label={GGR}
                                valueList={commissionValueList}
                                onChange={(e) => this.handleChangeComm(e, 'PlatformFeeSetting')} />
                        </Form>
                    </Col>
                </FormGroup>
                <TierSetting
                    groupProductId={groupProductId}
                    handleClick={handleClick}
                    isDisableAddButton={isDisableAddButton}
                    btnText={btnText}
                />
            </div>
        )
    }
}