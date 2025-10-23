import React from 'react';

const ReportTitle = React.forwardRef((props, ref) => {
    return (
        <div className="report-title-container" ref={ref}>
            <div className="report-title">{props.content}</div>
        </div>
    )
})

export default ReportTitle;