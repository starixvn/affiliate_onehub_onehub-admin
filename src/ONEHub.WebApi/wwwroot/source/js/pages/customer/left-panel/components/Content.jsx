import React from 'react';
import { connect } from 'react-redux';

import SearchBox from './SearchBox';
import MainInfo from './MainInfo';

export const Content = (props) => {
    return (
        <div className="left-panel-container">
            <SearchBox />
            {props.affiliateInfo && <MainInfo />}
        </div>
    )
}

function mapStateToProps({ leftPanel }) {
    const { affiliateInfo } = leftPanel;
    return Object.assign({}, { affiliateInfo });
};

export default connect(mapStateToProps)(React.memo(Content));