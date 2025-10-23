import React from 'react';
import { isActiveMenu } from '../modules/service';
import UserPanelMenuItem from './UserPanelMenuItem';

export const UserPanelMenu = (props) => {
    const { selectedUserPanel, onClickMenu, menuList } = props;
    const selectedMenuItem = menuList.find(p => p.key === selectedUserPanel);

    return (
        <div className="user-panel-menu-container">
            <span className="icon-userpanel"></span>
            <ul className="d-inline-block menu-list">
                {
                    menuList.filter(item => !item.parent).map(item => {
                        return (
                            <UserPanelMenuItem key={item.key} item={item}
                                isActive={isActiveMenu(selectedMenuItem, item)}
                                onClickMenu={onClickMenu} />
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default React.memo(UserPanelMenu);