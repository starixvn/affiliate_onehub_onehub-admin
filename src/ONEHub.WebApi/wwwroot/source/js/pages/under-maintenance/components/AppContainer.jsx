import React, { PureComponent } from 'react';

export default class AppContainer extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const { umTimeFrom, umTimeTo } = this.props;

        return (
            <div className="under-maintenance-container">
                <div className="text_time text_top">
                    {
                        umTimeFrom
                    }
                    <font color="#555"> until </font>
                    {
                        umTimeTo
                    }
                </div>
                <div className="gmt_english">
                    (HK Time GMT+8)
                </div>
                <div className="text_time text_button">
                    {
                        umTimeFrom
                    }
                    <font color="#555"> 至 </font>
                    {
                        umTimeTo
                    }
                </div>
                <div className="gmt_chinese">
                    (香港时间GMT+8)
                </div>
            </div>
        )
    }
}