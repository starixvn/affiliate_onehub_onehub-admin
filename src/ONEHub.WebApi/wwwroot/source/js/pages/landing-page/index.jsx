import React, { Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ClaimPrincipal from '../../modules/claim';
import AppLayout from '../../layouts/AppLayout';
import SubMenuList from '../common/components/SubMenuList';
import { menus } from './libs/menus';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from '@/components/ErrorBoundary';

const App = () => {
    const getRenderMenuItems = () => {
        const claims = ClaimPrincipal.currentClaimPrincipal;
        const renderMenuList = menus.filter((menu) => menu.renderClaim === undefined || claims.hasClaim(menu.renderClaim));
        return renderMenuList;
    }

    const renderMenuList = getRenderMenuItems();
    const imgSrc = '/dist/imgs/i_landing.png';
    const firstMenu = renderMenuList && renderMenuList.length > 0 ? renderMenuList[0] : null;

    // ✅ SHOW UI IMMEDIATELY!
    // Child components will show "Loading..." for dropdowns until filters arrive
    return (
        <AppLayout>
            <ErrorBoundary>
                <Router>
                    <SubMenuList
                        img={imgSrc}
                        menus={renderMenuList && renderMenuList.length > 0 ? renderMenuList.map((menu) => { return { label: menu.label, href: menu.href } }) : []}
                        menuTitle="Landing Page Management"
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
                            {firstMenu && <Redirect from="/" to={firstMenu.href} exact />}
                        </Switch>
                    </Suspense>
                    <ToastContainer className="landing-page-toast-container" />
                </Router>
            </ErrorBoundary>
        </AppLayout>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));