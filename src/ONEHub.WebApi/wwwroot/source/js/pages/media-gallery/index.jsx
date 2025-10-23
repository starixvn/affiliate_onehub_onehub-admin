import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import ClaimPrincipal from '../../modules/claim';
import SubMenuList from '../common/components/SubMenuList';
import { menus } from './libs/menus';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    _getRenderMenuItems = () => {
        const claims = ClaimPrincipal.currentClaimPrincipal;
        const renderMenuList = menus.filter((menu) => menu.renderClaim === undefined || claims.hasClaim(menu.renderClaim));
        return renderMenuList;
    }

    render() {
        var renderMenuList = this._getRenderMenuItems();
        const imgSrc = 'Areas/Portal/www/dist/imgs/i_media.png';
        const firstMenu = renderMenuList[0];
        return (
            <Router forceRefresh={true}>
                <SubMenuList img={imgSrc}
                    menus={renderMenuList.map((menu) => { return { label: menu.label, href: menu.href } })} />
                <Suspense fallback={null}>
                    <Switch>
                        {renderMenuList.map((menu, index) => <Route key={`route_${index}`} path={menu.href} component={menu.component} />)}
                        {firstMenu && <Redirect from="/" to={firstMenu.href} />}
                    </Switch>
                </Suspense>
            </Router>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"));