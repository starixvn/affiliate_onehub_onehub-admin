import React from 'react';
import { connect } from 'react-redux';

import CommissionPanel from './panel/CommissionPanel';
import SettingPanel from './panel/SettingPanel';
import OnlineInfoPanel from './panel/OnlineInfoPanel';
import { statusForSuspend } from '../libs/constants';

export const PanelList = (props) => {
    const { affiliateInfo } = props;
    const status = affiliateInfo.Status.toLowerCase();
    const isApproved = status === statusForSuspend.Approved || status === statusForSuspend.Suspended;

    return (
        <React.Fragment>
            {isApproved && <CommissionPanel />}
            {<SettingPanel isApproved={isApproved} />}
            {isApproved && <OnlineInfoPanel />}
        </React.Fragment>
    )
}

function mapStateToProps({ leftPanel }) {
    const { affiliateInfo } = leftPanel;

    return Object.assign({}, { affiliateInfo });
};

export default connect(mapStateToProps)(React.memo(PanelList));