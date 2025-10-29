import React from 'react';
import { Button } from 'reactstrap';

import ButtonDeleteItems from './ButtonDeleteItems';
import { defaultInsertId } from '../../../modules/constants';
import { globalResource } from '../../../modules/globalResource';

export const ControlButtons = (props) => {

    function _handleAddItem() {
        props.setSelectedItemId(defaultInsertId);
        props.setShouldResetScrollPosition(false);
    }

    function _handleClickOptionButton() {
        props.clickOptionButton && props.clickOptionButton();
        props.setShouldResetScrollPosition(false);
    }

    const hasData = props.gridData && props.gridData.length;
    const label = props.label || globalResource.Add;
    const optionLabel = props.optionLabel;
    
    // Check if any items are selected
    const hasSelectedItems = props.checkedItems && Object.keys(props.checkedItems).some(key => {
        const item = props.checkedItems[key];
        return typeof item === 'boolean' ? item : (item && item.isChecked);
    });

    return props.gridData && (
        <React.Fragment>
            {
                hasData ? (
                    <React.Fragment>
                        <div className="my-2">
                            <ButtonDeleteItems
                                checkedItems={props.checkedItems}
                                toggleLoader={props.toggleLoader}
                                deleteItems={props.deleteItems}
                                fetchData={() => props.fetchData(props.param)}
                                messages={props.messages}
                                hasIcon={true}
                                isOpenNotification={true}
                                disabled={!hasSelectedItems}
                            />
                            <Button outline type="button" className="mx-2" onClick={_handleAddItem}>{label} <span className="oi oi-plus ml-2"></span></Button>
                            {
                                !!optionLabel && (
                                    <Button outline type="button" disabled={!hasSelectedItems} onClick={() => _handleClickOptionButton()}><div dangerouslySetInnerHTML={{ __html: optionLabel }}></div></Button>
                                )
                            }
                        </div>
                    </React.Fragment>
                ) : (
                        <div className="my-2">
                            <Button outline type="button" onClick={_handleAddItem}>{label} <span className="oi oi-plus ml-2"></span></Button>
                        </div>
                    )
            }
        </React.Fragment>
    );
}

export default React.memo(ControlButtons);