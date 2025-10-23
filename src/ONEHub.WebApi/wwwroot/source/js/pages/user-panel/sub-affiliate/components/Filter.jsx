import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, FormGroup, Input, Label } from 'reactstrap';

import { globalResource, defaultBaseCurrency } from '../libs/constants';
import { setParam } from '../actions';
import { htmlDecode } from '../../../../modules/htmlHelper';

export class Filter extends PureComponent {
    constructor(props) {
        super(props);

        const { baseCurrencyList } = this.props;

        this.state = {
            selectedBaseCurrency: (baseCurrencyList && baseCurrencyList.length && baseCurrencyList[0].ExchangeId) || defaultBaseCurrency
        }
    }

    componentDidMount() {
        this.handleSetParam();
    }

    handleChangeBaseCurrency = (event) => {
        const selectedBaseCurrency = Number(event.target.value);
        this.setState({ selectedBaseCurrency }, this.handleSetParam);
    }

    handleSetParam() {
        const { selectedBaseCurrency } = this.state;
        const param = Object.assign(this.props.param, { currencyId: selectedBaseCurrency });
        this.props.setParam(param);
    }

    render() {
        const { selectedBaseCurrency } = this.state;
        const { baseCurrencyList } = this.props;

        return (
            <div className="filter-container">
                <Form inline tag="div">
                    {
                        baseCurrencyList && baseCurrencyList.length &&
                        <FormGroup className="mr-sm-2">
                            <Label className="mr-2">{globalResource.BaseCurrency}</Label>
                            <Input type="select" name="BaseCurrency" id="BaseCurrency" value={selectedBaseCurrency} onChange={this.handleChangeBaseCurrency}>
                                {
                                    baseCurrencyList.map(c => {
                                        return (<option key={c.ExchangeId} value={c.ExchangeId}>{htmlDecode(c.Code)}</option>)
                                    })
                                }
                            </Input>
                        </FormGroup>
                    }
                </Form>
            </div>
        );
    }
}

function mapStateToProps({ subAffiliate }) {
    const { affId, monthDate } = subAffiliate.param;
    return Object.assign({}, { param: { affId, monthDate } });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParam }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);