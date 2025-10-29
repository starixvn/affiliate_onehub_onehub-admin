import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import ClaimPrincipal from '@/modules/claim';
import AppLayout from '../../layouts/AppLayout';
import SubMenuList from '@/pages/common/components/SubMenuList';
import { menuKey, relativePath } from './constants/menu';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from '@/components/ErrorBoundary';

const AllCampaigns = React.lazy(() => import('./pages/all-campaign/index'));
const ComponentManagement = React.lazy(() => import('./pages/component-management/index'));

const menus = [
    { key: menuKey.allCampaigns, label: 'All Campaigns', href: relativePath.allCampaigns, component: AllCampaigns },
    // { key: menuKey.componentManagement, label: 'Component Management', href: relativePath.componentManagement, component: ComponentManagement },
];

const App = () => {
    const getRenderMenuItems = () => {
        const claims = ClaimPrincipal.currentClaimPrincipal;
        const renderMenuList = menus.filter((menu) => menu.renderClaim === undefined || claims.hasClaim(menu.renderClaim));
        return renderMenuList;
    }

    const renderMenuList = getRenderMenuItems();
    const imgSrc = '/dist/imgs/i_campaign_management.png';
    const firstMenu = renderMenuList[0];

    return (
        <AppLayout>
            <ErrorBoundary>
                <Router>
                    <SubMenuList
                        img={imgSrc}
                        menus={renderMenuList.map((menu) => { return { label: menu.label, href: menu.href } })}
                        menuTitle="Campaign Management"
                    />
                    <Suspense fallback={<div>Loading...</div>}>
                        <Switch>
                            {renderMenuList.map((menu, index) => (
                                <Route
                                    key={`route_${index}`}
                                    path={menu.href}
                                    component={menu.component}
                                    exact
                                />
                            ))}
                            {firstMenu && <Redirect exact from="/" to={firstMenu.href} />}
                        </Switch>
                    </Suspense>
                    <ToastContainer className="campaign-management-toast-container" />
                </Router>
            </ErrorBoundary>
        </AppLayout>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
