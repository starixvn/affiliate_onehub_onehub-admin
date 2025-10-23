import React from 'react';
import { Button } from 'reactstrap';

export const Panel = (props) => {
    const { heading, children, style, ...attributes } = props;

    return (
        <div className="left-submenu" {...attributes}>
            <ul>
                <li>
                    <Button color="link" className="left-panel-btn-link hide-link">
                        {heading}
                    </Button>
                </li>
            </ul>
            <div className="content" style={{ ...style }}>
                {children}
            </div>
        </div>
    )
}

export default React.memo(Panel);