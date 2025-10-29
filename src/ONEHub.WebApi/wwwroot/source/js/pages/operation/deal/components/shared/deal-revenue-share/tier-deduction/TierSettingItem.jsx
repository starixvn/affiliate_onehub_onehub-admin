import React from 'react';

import { Input } from 'reactstrap';
import { commissionValueList, format, money, firstMinNetWinValueList, NEGATIVE_INFINITY_SYMBOL, regexAcceptNegativeAmountFormat, regexValidNegativeAmount } from '../../../../libs/revenue-share-constants';

export default class TierSettingItem extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    handleChangeAmount = (event) => {
        const { name, value } = event.target;
        const amount = value.replace(/,/g, '');

        if (regexAcceptNegativeAmountFormat.test(amount)) {
            if (regexValidNegativeAmount.test(amount)) {
                const amountNumber = Number(amount);

                if (amountNumber < money.AllowedMinValue || amountNumber > money.AllowedMaxValue) {
                    return;
                }
            }

            const { data, onChange } = this.props;

            const newItem = { [name]: amount };

            onChange && onChange(data.TierId, newItem);
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const value = Number(target.value.replace(/,/g, ''));
        const name = target.name;

        const { data, onChange } = this.props;

        const newItem = { [name]: value || 0 };

        onChange && onChange(data.TierId, newItem);
    }

    handleGetMinAmount = (minAmount, isValidAmount) => {
        return isValidAmount ? format(Number(minAmount)) : minAmount;
    }

    handleChangeFirstMinNetWin = (event) => {
        const isNegativeInfinity = event.target.value === NEGATIVE_INFINITY_SYMBOL;
        const { data, onChange } = this.props;

        const newItem = isNegativeInfinity ? { MinAmount: money.AllowedMinValue } : { MinAmount: 0 };

        onChange && onChange(data.TierId, newItem);
    }

    render() {
        const { index, data, handleClick, btnText, isFirst } = this.props;
        const { TierId, MinAmount, MinQm, Commission } = data;

        const isValidAmount = regexValidNegativeAmount.test(MinAmount);
        const isNegativeInfinity = MinAmount == money.AllowedMinValue;

        return (
            <tr>
                <td className="text-center">{index}</td>
                <td>
                    {
                        isFirst ? (
                            <select className="form-control" name="MinAmount" id={"MinAmount" + TierId}
                                onChange={this.handleChangeFirstMinNetWin} value={isNegativeInfinity ? NEGATIVE_INFINITY_SYMBOL : this.handleGetMinAmount(MinAmount, isValidAmount)}>
                                {
                                    Object.keys(firstMinNetWinValueList).map(key => {
                                        return (<option key={`MinAmount-${key}`} value={key}>{firstMinNetWinValueList[key]}</option>);
                                    })
                                }
                            </select>
                        ) : (
                                <Input className={isValidAmount ? "" : "has-error"} type="text" name="MinAmount" id={"MinAmount" + TierId}
                                    value={this.handleGetMinAmount(MinAmount, isValidAmount)} onChange={this.handleChangeAmount} />
                            )
                    }
                </td>
                <td>
                    <Input type="text" name="MinQm" id={"MinQm" + TierId} value={format(MinQm)} onChange={this.handleChange} />
                </td>
                <td>
                    <select className="form-control" name="Commission"
                        onChange={this.handleChange} value={format(Commission || 0, 3)}>
                        {
                            Object.keys(commissionValueList).map((key, i) => {
                                return (<option key={`comm-${i}`} value={key}>{commissionValueList[key]}</option>);
                            })
                        }
                    </select>
                </td>
                <td className="text-center">
                    <button type="button" className="btn btn-action" onClick={handleClick}>{btnText}</button>
                </td>
            </tr>
        )
    }
}