import React from 'react';
import PropTypes from 'prop-types';

const NO_SELECTION_LABEL = "No Selection";
const MAX_SELECTED_ITEM_FOR_DISPLAY = 3;

function getSelectedItemsString(props) {
    const { selectedItems, noneSelectedLabel, maxDisplayItemCount, isSelectedAll, selectedAllLabel } = props;
    const selectedValues = selectedItems.map(item => item.value);

    let displayText = noneSelectedLabel;
    const selectedItemCount = selectedValues.length;

    if (selectedItemCount > maxDisplayItemCount) {
        displayText = `${selectedItemCount} selected`;
    }
    else if (selectedItemCount >= 1) {
        displayText = selectedValues.join(", ");
    }

    if (isSelectedAll && !!selectedAllLabel) {
        displayText = selectedAllLabel
    }

    return displayText;
}

const MultipleSelectLabel = (props) => {
    const selectedItemString = getSelectedItemsString(props);

    return (
        <button id={`${props.id}`} type="button" className="multiple-select-default multiple-select-label"
            onClick={props.onToggle}>
            <span className="text-display" title={selectedItemString}>{selectedItemString}</span>
            <b className="caret"></b>
        </button>
    )
}

MultipleSelectLabel.propTypes = {
    selectedItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    noneSelectedLabel: PropTypes.string,
    isSelectedAll: PropTypes.bool,
    selectedAllLabel: PropTypes.string,
    maxDisplayItemCount: PropTypes.number
}

MultipleSelectLabel.defaultProps = {
    isSelectedAll: false,
    selectedAllLabel: '',
    noneSelectedLabel: NO_SELECTION_LABEL,
    maxDisplayItemCount: MAX_SELECTED_ITEM_FOR_DISPLAY
}

export default MultipleSelectLabel;