import React from 'react';
import { connect } from 'react-redux';

import GeneralInfo from './GeneralInfo';
import PanelList from './PanelList';

export const MainInfo = (props) => {
    return props.affiliateInfo && (
        <div>
            <GeneralInfo />
            <PanelList />
        </div>
    );
}

function mapStateToProps({ leftPanel }) {
    const { affiliateInfo } = leftPanel;
    return Object.assign({}, { affiliateInfo });
}

export default connect(mapStateToProps)(React.memo(MainInfo));