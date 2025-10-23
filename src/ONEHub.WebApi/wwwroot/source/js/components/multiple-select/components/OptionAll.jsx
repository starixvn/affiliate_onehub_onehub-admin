import React from 'react';
import PropTypes from 'prop-types';
import Option from './Option';

const LABEL = "All";
const DEFAULT_CHECKED = false;
const DEFAULT_DISABLE = false;

const OptionAll = (props) => {
    const { id, checked, label, onChange, isDisable } = props;

    const itemData = {
        key: "All",
        value: label,
        checked
    }

    const changeHandler = ({ checked }) => {
        onChange && onChange(checked);
    }

    return (
        <ul className="multiple-select-options multiple-select-option-all">
            <Option
                id={`${id}-optionItemAll`}
                itemData={itemData}
                onChange={changeHandler}
                isDisable={isDisable} />
        </ul>
    )
}

OptionAll.propTypes = {
    onChange: PropTypes.func,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    label: PropTypes.string,
    checked: PropTypes.bool,
    isDisable: PropTypes.bool
}

OptionAll.defaultProps = {
    label: LABEL,
    checked: DEFAULT_CHECKED,
    isDisable: DEFAULT_DISABLE
}

export default OptionAll;