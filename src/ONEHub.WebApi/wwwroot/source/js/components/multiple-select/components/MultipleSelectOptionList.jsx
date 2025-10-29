import React from 'react';
import PropTypes from 'prop-types';
import Option from './Option';

const MultipleSelectOptionList = (props) => {
    const { dataSource, onChange, id, isDisable } = props;

    return (
        <ul className="multiple-select-options">
            {
                dataSource.map((item, index) => {
                    return (
                        <Option
                            id={`${id}-optionItem-${index}`}
                            key={`${id}optionItem${index}`}
                            itemData={item}
                            onChange={onChange}
                            isDisable={isDisable} />
                    )
                })
            }
        </ul>
    )
}

MultipleSelectOptionList.propTypes = {
    dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    onChange: PropTypes.func,
    isDisable: PropTypes.bool
}

export default MultipleSelectOptionList;