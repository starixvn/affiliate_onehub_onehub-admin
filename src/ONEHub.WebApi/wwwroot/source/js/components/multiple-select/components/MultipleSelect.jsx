import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MultipleSelectLabel from './MultipleSelectLabel';
import MultipleSelectOptionList from './MultipleSelectOptionList';
import OptionAll from './OptionAll';

const KEY_NAME = "key";
const VALUE_NAME = "value";
const STATUS_NAME = "checked";
const IS_DISABLED_ITEM_NAME = 'isDisabledItem';

let id = 1;

export default class MultipleSelect extends PureComponent {
    constructor(props) {
        super(props);
        this.id = props.id || `multiple-select-${id++}`;

        this.state = {
            showOptionList: false,
            inputOption: ''
        }
    }

    static propTypes = {
        dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
        keyField: PropTypes.string,
        valueField: PropTypes.string,
        statusField: PropTypes.string,
        isDisableItemField: PropTypes.bool,
        noneSelectedLabel: PropTypes.string,
        optionAllLabel: PropTypes.string,
        maxDisplayItemCount: PropTypes.number,
        onChange: PropTypes.func,
        hasAllOption: PropTypes.bool,
        hasInputOption: PropTypes.bool,
        isDisable: PropTypes.bool
    }

    static defaultProps = {
        keyField: KEY_NAME,
        valueField: VALUE_NAME,
        statusField: STATUS_NAME,
        isDisableItemField: IS_DISABLED_ITEM_NAME,
        hasAllOption: true,
        hasInputOption: false,
        isDisable: false
    }

    componentDidMount() {
        document.addEventListener('click', this._handleDocumentClick)
    }

    componentWillUnmount() {
        document.removeEventListener('click', this._handleDocumentClick)
    }

    onChangeHandler = (item) => {
        const { keyField, valueField, statusField, isDisableItemField, dataSource } = this.props;

        const selectedItem = {
            [keyField]: item.key,
            [valueField]: item.value,
            [statusField]: item.checked,
            [isDisableItemField]: item.isDisabledItem || false
        }

        const newDataSource = dataSource.map(option => {
            const newItem = Object.assign({}, option);

            if (newItem[keyField] === item.key) {
                newItem[statusField] = item.checked;
            }

            return {
                [KEY_NAME]: newItem[keyField],
                [VALUE_NAME]: newItem[valueField],
                [STATUS_NAME]: newItem[statusField],
                [IS_DISABLED_ITEM_NAME]: newItem[isDisableItemField] || false
            }
        });

        this._callBackToParent(selectedItem, newDataSource);
    }

    onToggle = () => {
        this.setState((prevState) => { return { showOptionList: !prevState.showOptionList, inputOption: '' } })
    }

    checkAllHandler = (checked) => {
        const { keyField, valueField, statusField, isDisableItemField, dataSource } = this.props;

        const newDataSource = dataSource.map(item => {
            return {
                key: item[keyField],
                value: item[valueField],
                checked: item[isDisableItemField] ? item[statusField] : checked,
                isDisabledItem: item[isDisableItemField] || false
            }
        });

        this._callBackToParent(null, newDataSource);
    }

    _handleChangeInput = (event) => {
        const { target } = event;

        this.setState({ [target.name]: target.value });
    }

    _callBackToParent(selectedItem, newDataSource) {
        const selectedItemsKey = this._getSelectedItemKey(newDataSource);
        this.props.onChange && this.props.onChange(selectedItem, selectedItemsKey);
    }

    _convertDataSource(inputOption) {
        const { keyField, valueField, statusField, isDisableItemField, dataSource } = this.props;
        const dataSourceAfterFilter = dataSource.filter(i => i[valueField].toLowerCase().includes(inputOption || ''));

        return dataSourceAfterFilter.map(item => {
            return {
                [KEY_NAME]: item[keyField],
                [VALUE_NAME]: item[valueField],
                [STATUS_NAME]: item[statusField],
                [IS_DISABLED_ITEM_NAME]: item[isDisableItemField] || false
            }
        })
    }

    _getSelectedItemKey(dataSource) {
        const selectedItemKey = [];

        for (let item of dataSource) {
            if (item.checked) {
                selectedItemKey.push(item.key)
            }
        }

        return selectedItemKey.join(",");
    }

    _close = () => {
        this.setState({ showOptionList: false, inputOption: '' });
    }

    _handleDocumentClick = (event) => {
        const clickOutside = this.wrapper && !this.wrapper.contains(event.target);

        if (clickOutside && this.state.showOptionList) {
            this._close();
        }
    }

    _renderOptionAll(dataSource) {
        const checkedItemCount = dataSource.filter(x => x.checked).length;
        const dataSourceWithoutDisabledItem = dataSource.filter(x => !x.isDisabledItem);
        const checkedAll = checkedItemCount > 0 && checkedItemCount === dataSourceWithoutDisabledItem.length;
        const disableItems = dataSource.filter(x => x.isDisabledItem);
        const isDisableItem = disableItems && disableItems.length === dataSource.length;

        const { optionAllLabel, isDisable } = this.props;

        return (<OptionAll id={`option-all-${this.id}`} checked={checkedAll} label={optionAllLabel} onChange={this.checkAllHandler} isDisable={isDisable || isDisableItem} />);
    }

    render() {
        const { inputOption } = this.state;
        const { noneSelectedLabel, maxDisplayItemCount, hasAllOption, isDisable, hasInputOption, statusField, selectedAllLabel } = this.props;
        const isSelectedAll = this.props.dataSource.every(d => d[statusField]);
        const inputOptionTrim = inputOption.trim();
        const dataSource = this._convertDataSource(inputOptionTrim.toLowerCase());
        const dataSourceLabel = this._convertDataSource();
        const selectedItems = dataSourceLabel.filter(item => item.checked);

        return (
            <div className="multiple-select-container" id={`multiple-select-${this.id}`} ref={element => this.wrapper = element}>
                <MultipleSelectLabel
                    id={this.id}
                    selectedItems={selectedItems}
                    onToggle={this.onToggle}
                    noneSelectedLabel={noneSelectedLabel}
                    isSelectedAll={isSelectedAll}
                    selectedAllLabel={selectedAllLabel}
                    maxDisplayItemCount={maxDisplayItemCount} />

                <div className="multiple-select-default multiple-select-options-container"
                    style={{ display: this.state.showOptionList ? "block" : "none" }}>
                    {
                        hasInputOption &&
                        <ul className="multiple-select-options">
                            <input type="text" name="inputOption" value={inputOption} className="w-100" onChange={this._handleChangeInput} />
                        </ul>
                    }

                    {hasAllOption && !inputOptionTrim && this._renderOptionAll(dataSource)}

                    <MultipleSelectOptionList id={this.id}
                        dataSource={dataSource}
                        onChange={this.onChangeHandler}
                        isDisable={isDisable} />
                </div>
            </div>
        )
    }
}