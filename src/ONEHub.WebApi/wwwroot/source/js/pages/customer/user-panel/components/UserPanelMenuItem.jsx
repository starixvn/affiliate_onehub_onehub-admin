import React from 'react';

export const UserPanelMenuItem = (props) => {
    const { item, isActive, onClickMenu } = props;

    return (
        <li key={item.key} className="up-item">
            <a href="javascript:;" className={`upitem-link ${isActive ? 'active' : ''}`}
                onClick={() => onClickMenu(item.key)}>
                <span className="menu-text">{item.name}</span>
            </a>
        </li>
    )
}

export default React.memo(UserPanelMenuItem);