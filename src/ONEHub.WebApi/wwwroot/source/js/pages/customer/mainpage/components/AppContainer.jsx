import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row } from 'reactstrap';

import AppLayout from '../../../../layouts/AppLayout';
import LeftPanel from '../../left-panel/components/AppContainer';
import UserPanel from '../../user-panel/components/UserPanel';
import { setSelectedUserPanel } from '../../user-panel/actions';
import { setUserPanelMenuCookie } from '../../../../modules/utils';

export const CustomerStatistics = React.lazy(() =>
    import(/* webpackChunkName: "customer-statistics" */ '../../customer-statistics/components/AppContainer'));

export const AppContainer = (props) => {
    const { affId, selectedUserPanel, status } = props;
    const isPending = status && (status.toLowerCase() === 'pending' || status.toLowerCase() === 'disapproved');

    const handleClickUserPanelMenu = (userPanelMenu) => {
        setUserPanelMenuCookie(userPanelMenu);

        props.setSelectedUserPanel(userPanelMenu);
    }

    return (
        <AppLayout>
            <div className='data-content m-2'>
                <Row>
                    <div className="left-panel">
                        <LeftPanel />
                    </div>
                    {
                        affId && (
                            <div className="right-panel mx-2">
                                <div className="customer-statistics">
                                    {
                                        !isPending &&
                                        <Suspense fallback={null}>
                                            <CustomerStatistics />
                                        </Suspense>
                                    }
                                </div>
                                <div className="user-panel">
                                    {
                                        selectedUserPanel &&
                                        <UserPanel selectedUserPanel={selectedUserPanel} onClickMenu={handleClickUserPanelMenu} isPending={isPending} />
                                    }
                                </div>
                            </div>
                        )
                    }
                </Row>
            </div>
        </AppLayout>
    );
}

function mapStateToProps({ selectedUserPanel, affCommonInfo }) {
    const { affId, status } = affCommonInfo || { affId: null, status: null }

    return Object.assign({}, { selectedUserPanel, affId, status });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedUserPanel }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AppContainer));