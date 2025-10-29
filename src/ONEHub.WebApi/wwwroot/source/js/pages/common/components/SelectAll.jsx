import React from 'react';
import { Button } from 'reactstrap';

import { resource } from '../modules/constants/selectAll';

export const SelectAll = (props) => {

    function _onCheckAll(isCheckAll) {
        const { checkedList } = props;
        const newCheckedList = Object.keys(checkedList).reduce((accumulator, currentValue) => {
            accumulator[currentValue] = isCheckAll;

            return accumulator;
        }, {});

        props.setShouldResetScrollPosition(false);
        props.setCheckedList(newCheckedList);
    }

    return (
        <div className="d-flex align-items-center">
            <span>{resource.Select}:</span>
            <Button type="button" color="link" className="text-dark font-weight-bold" onClick={() => _onCheckAll(true)}>
                <u>{resource.All}</u>
            </Button>
            <Button type="button" color="link" className="text-dark font-weight-bold" onClick={() => _onCheckAll(false)}>
                <u>{resource.None}</u>
            </Button>
        </div>
    );
}

export default React.memo(SelectAll);