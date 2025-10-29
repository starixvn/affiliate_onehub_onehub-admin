import React from 'react';
import PropTypes from 'prop-types';

const Option = React.forwardRef((props, ref) => {
    const { itemData, onChange, id } = props;

    const handleChange = (event) => {
        event.stopPropagation();

        const newItemData = {
            key: itemData.key,
            value: itemData.value
        }

        onChange && onChange(newItemData);
    }

    return (
        <li className="select-item" id={id} onClick={handleChange} ref={ref}>
            <span className="option-label">
                {itemData.value}
            </span>
        </li>
    );
})

Option.propTypes = {
    itemData: PropTypes.object.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    onChange: PropTypes.func
}

export default Option;