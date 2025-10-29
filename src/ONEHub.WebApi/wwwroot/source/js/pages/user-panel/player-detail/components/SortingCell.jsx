import React from 'react';
import { Button } from 'reactstrap';
import { Cell } from '@9softstudio/react-fixed-table-header';

export const SortingCell = (props) => {
    const { isSortAsc, sortingColumn, columnName, title } = props;
    const isSelectedColumn = sortingColumn === columnName;

    return (
        <Cell header={true} colWidth={100} className="th">
            <Button className="p-0 th-wrapper btn btn-link" color="link" onClick={() => props.handleClickHeader(columnName)}>
                <span>{title}</span>
                <div className="icon-container">
                    <span className={`caret asc ${isSelectedColumn && isSortAsc ? "current" : ''}`}></span>
                    <span className={`caret desc ${isSelectedColumn && !isSortAsc ? "current" : ''}`}></span>
                </div>
            </Button>
        </Cell>
    )
}

export default React.memo(SortingCell);