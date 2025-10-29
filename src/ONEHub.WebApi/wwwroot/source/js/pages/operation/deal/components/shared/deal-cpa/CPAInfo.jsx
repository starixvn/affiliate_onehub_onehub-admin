import React from 'react';

import Player from './cpa-info-sections/Player';
import Affiliate from './cpa-info-sections/Affiliate';
import TierSetting from './tier-setting/TierSetting';

export const CPAInfo = () => {
    return (
        <React.Fragment>
            <Player />
            <Affiliate />
            <TierSetting />
        </React.Fragment>
    );
};


export default React.memo(CPAInfo);