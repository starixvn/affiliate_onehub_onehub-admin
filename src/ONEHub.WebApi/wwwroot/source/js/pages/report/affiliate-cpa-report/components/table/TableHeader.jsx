import React from 'react'
import { Button } from 'reactstrap';
import { Cell } from '@9softstudio/react-fixed-table-header';
import { connect } from 'react-redux';
import { setParams, toggleSubmit } from '../../actions';
import { bindActionCreators } from 'redux';
import { headers } from '../../libs/constants';

export const TableHeader = ({ sortType, sortDirectionType, setParams, toggleSubmit }) => {
    const handleClickHeader = (sortable, sortTypeSelected) => {
        if(!sortable) return;
        
        setParams({
            sortType: sortTypeSelected,
            sortDirectionType: sortTypeSelected === sortType ? !sortDirectionType : false
        });
        toggleSubmit();
    }

    return (
        <thead>
            <tr className='freeze-row'>
                {
                    headers.map((header) => (
                        <Cell header={true} style={{'width': header.width}} className="th freeze-column-header" title={header.title}>
                            <Button 
                                className="th-wrapper" 
                                color="link" 
                                onClick={() => handleClickHeader(header.sortable, header.sortType)}>
                                <span>{header.title}</span>
                                {
                                    header.sortable && (
                                        <div className="icon-container">
                                            <span className={`caret asc ${sortType === header.sortType && !sortDirectionType ? "current" : ''}`}></span>
                                            <span className={`caret desc ${sortType === header.sortType && sortDirectionType ? "current" : ''}`}></span>
                                        </div>
                                    )
                                }
                            </Button>
                        </Cell>
                    ))
                }
            </tr>
        </thead>
    )
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ setParams, toggleSubmit }, dispatch);

}

export default connect(null, mapDispatchToProps)(TableHeader);
