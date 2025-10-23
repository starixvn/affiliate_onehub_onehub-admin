import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import ClaimPrincipal from '../../modules/claim';
import SubMenuList from '../common/components/SubMenuList';
import { menus } from './libs/menus';

const imgSrc = 'Areas/Portal/www/dist/imgs/i_operation.png';

const App = () => {

    const _renderMenu = () => {
        const claims = ClaimPrincipal.currentClaimPrincipal;
        const renderMenuList = menus.filter((menu) => menu.renderClaim === undefined || claims.hasClaim(menu.renderClaim));

        return renderMenuList;
    }

    const renderMenuList = _renderMenu();
    const firstMenu = renderMenuList[0];

    return (
        <Router forceRefresh>
            <SubMenuList img={imgSrc} menus={renderMenuList.map((menu) => { return { label: menu.label, href: menu.href } })} />
            <Suspense fallback={null}>
                <Switch>
                    {renderMenuList.map((menu, index) => <Route key={`route_${index}`} path={menu.href} component={menu.component} />)}
                    {firstMenu && <Redirect from='/' to={firstMenu.href} />}
                </Switch>
            </Suspense>
        </Router>
    );
}

export default App;

ReactDOM.render(<App />, document.getElementById('root'));