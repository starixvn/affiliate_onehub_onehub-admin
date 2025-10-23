import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';

const UserPanelSubMenu = (props) => {
    const subMenuList = props.subMenuList || null;

    return subMenuList && (
        <div className="sub-menu-container pt-1">
            <Nav>
                {
                    subMenuList.map(item => {
                        return (
                            <NavItem key={item.title}>
                                <NavLink active={item.isActive} href="javascript:;" onClick={item.handleClick}>{item.title}</NavLink>
                            </NavItem>
                        )
                    })
                }
            </Nav>
        </div>
    );
}

export default React.memo(UserPanelSubMenu);