import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, FormGroup, Input, Label } from 'reactstrap';

import { setParam } from '../actions';
import { selectedAllProduct, globalResource, defaultBaseCurrency } from '../modules/constants';
import { htmlDecode } from '../../../../modules/htmlHelper';
import MultipleSelect from '../../../../components/multiple-select';
import Select from '../../../../components/select';
import { handleChangeMultipleSelected } from '../../../../modules/utils';

export class Filter extends PureComponent {
    constructor(props) {
        super(props);

        const { param, baseCurrencyList, currencyList } = this.props;

        this.state = {
            selectedProduct: param.productId || selectedAllProduct,
            selectedBaseCurrency: param.baseCurrencyId || (baseCurrencyList && baseCurrencyList.length && baseCurrencyList[0].ExchangeId) || defaultBaseCurrency,
            selectedCurrencyList: param.currencyIds || currencyList && currencyList.filter(item => item.checked).map(item => item.key).join(',') || '',
            currencyList: !!param.currencyIds ? handleChangeMultipleSelected(currencyList, param.currencyIds) : currencyList
        }
    }

    componentDidMount() {
        this.handleSetParam();
    }

    handleChangeProduct = (selectedProduct) => {
        this.setState({ selectedProduct }, this.handleSetParam);
    }

    handleChangeBaseCurrency = (event) => {
        const selectedBaseCurrency = Number(event.target.value);
        this.setState({ selectedBaseCurrency }, this.handleSetParam);
    }

    handleChangeCurrency = (item, selectedCurrencyList) => {
        const currencyList = handleChangeMultipleSelected(this.state.currencyList, selectedCurrencyList);

        this.setState({ selectedCurrencyList, currencyList }, this.handleSetParam);
    }

    handleSetParam() {
        const { selectedProduct, selectedBaseCurrency, selectedCurrencyList } = this.state;
        const param = Object.assign(this.props.param, { productId: selectedProduct, baseCurrencyId: selectedBaseCurrency, currencyIds: selectedCurrencyList });

        this.props.setParam(param);
    }

    render() {
        const { selectedProduct, selectedBaseCurrency, currencyList } = this.state;
        const { productList, baseCurrencyList, isProduction } = this.props;
        const dataSource = [{ ProductId: selectedAllProduct, ProductName: globalResource.All }].concat(productList);

        return (
            <div className="filter-container">
                <Form inline tag="div">
                    <FormGroup className="mr-sm-2">
                        <Label className="mr-2">{globalResource.Product}</Label>
                        <Select
                            dataSource={dataSource}
                            keyField="ProductId"
                            valueField="ProductName"
                            hasInputOption={true}
                            selectedKey={selectedProduct}
                            onChange={this.handleChangeProduct} />
                    </FormGroup>
                    {
                        baseCurrencyList && baseCurrencyList.length !== 0 &&
                        <FormGroup className="mr-sm-2">
                            <Label className="mr-2">{globalResource.BaseCurrency}</Label>
                            <Input type="select" name="Currrency" id="Currrency" value={selectedBaseCurrency} onChange={this.handleChangeBaseCurrency}>
                                {
                                    baseCurrencyList.map(c => {
                                        return (<option key={c.ExchangeId} value={c.ExchangeId}>{htmlDecode(c.Code)}</option>)
                                    })
                                }
                                {
                                    !isProduction && <option value="20">UUS</option>
                                }
                            </Input>
                        </FormGroup>
                    }
                    {
                        !isProduction && currencyList && currencyList.length !== 0 &&
                        <FormGroup className="mr-sm-2">
                            <Label htmlFor="Currency" className="mr-2">{globalResource.Currency}</Label>
                            <MultipleSelect
                                dataSource={currencyList}
                                keyField="key"
                                valueField="name"
                                statusField="checked"
                                maxDisplayItemCount={1}
                                onChange={this.handleChangeCurrency} />
                        </FormGroup>
                    }
                </Form>
            </div>
        );
    }
}

function mapStateToProps({ dailyEarning, isProduction }) {
    const { param } = dailyEarning;
    return Object.assign({}, { param, isProduction });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParam }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);