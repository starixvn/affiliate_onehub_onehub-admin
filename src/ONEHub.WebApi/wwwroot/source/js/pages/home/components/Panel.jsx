import React from 'react';
import { Row } from 'reactstrap';

export const Panel = (props) => {
    const { heading, children, className } = props;

    return (
        <div>
            <Row className="home-panel-header">
                {/* <span className="home-panel-header-left"></span>
                <span className={className}></span> */}
                <span className="home-panel-header-right home-title">{heading}</span>
            </Row>
            <Row className="home-panel-body">
                {children}
            </Row>
        </div>
    )
}

export default React.memo(Panel);