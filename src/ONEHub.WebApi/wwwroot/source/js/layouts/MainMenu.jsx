import React, { PureComponent } from 'react';

export default class MainMenu extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showMarketingDropdown: false,
            dropdownLeftPosition: 0
        };
        this.marketingToolsRef = React.createRef();
        this.dropdownMenuRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }

    handleClickOutside = (e) => {
        if (this.state.showMarketingDropdown && !e.target.closest('.nav-item.dropdown')) {
            this.setState({ showMarketingDropdown: false });
        }
    }

    toggleMarketingDropdown = (e) => {
        e.preventDefault();
        
        if (!this.state.showMarketingDropdown && this.marketingToolsRef.current) {
            const rect = this.marketingToolsRef.current.getBoundingClientRect();
            const leftPosition = rect.right > window.innerWidth - 50 
                ? rect.right - 225 
                : rect.left;
            
            this.setState({ 
                showMarketingDropdown: true,
                dropdownLeftPosition: leftPosition
            });
        } else {
            this.setState({ showMarketingDropdown: false });
        }
    }

    getMenuDisplayName = (menuKey) => {
        const displayNames = {
            'MediaGallery': 'Media Gallery',
            'MarketingTools': 'Marketing Tools'
        };
        return displayNames[menuKey] || menuKey;
    }

    isMenuActive = (menuKey) => {
        const currentPath = window.location.hash || window.location.pathname;
        const menuPath = menuKey.toLowerCase();
        return currentPath.toLowerCase().includes(menuPath);
    }

    // Prefetch page bundle on hover for instant loading
    prefetchPage = (pageName) => {
        // Check if already prefetched
        if (document.querySelector(`link[href*="${pageName}.js"]`)) {
            return;
        }

        // Map menu keys to bundle names
        const bundleMap = {
            'home': 'home',
            'customer': 'customer/customer',
            'affiliate': 'affiliate/affiliate-info',
            'operation': 'operation/assign-deal',
            'report': 'report',
            'player': 'member/member-list',
            'mediagallery': 'media-gallery/media-gallery',
            'landingpage': 'landing-page',
            'campaignmanagement': 'campaign-management',
            'pagebuilder': 'landing-page',  // Same bundle as landingpage
            'assetuploader': 'landing-page',  // Same bundle as landingpage
            'formmanagement': 'landing-page'  // Same bundle as landingpage
        };

        const bundleName = bundleMap[pageName] || pageName;
        
        // Create prefetch link
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'script';
        link.href = `/dist/js/pages/${bundleName}.js`;
        document.head.appendChild(link);
    }

    render() {
        const { menus = [], currentController = 'Home' } = this.props;
        const { showMarketingDropdown, dropdownLeftPosition } = this.state;
        const isHomeActive = window.location.pathname === '/portal/home' || window.location.pathname === '/';

        return (
            <ul className="nav menu-list">
                <li className="nav-item">
                    <a 
                        className={`nav-link ${isHomeActive ? 'active' : ''}`} 
                        href="/portal/home"
                        onMouseEnter={() => this.prefetchPage('home')}
                        onTouchStart={() => this.prefetchPage('home')}>
                        Home
                    </a>
                </li>

                {menus.map((menu, index) => {
                    if (menu.Key === 'MarketingTools' && menu.Submenus && menu.Submenus.length > 0) {
                        const isActive = menu.Submenus.some(sub => this.isMenuActive(sub.Controller));
                        return (
                            <li key={index} className="nav-item dropdown" style={{ position: 'unset' }}>
                                <a 
                                    ref={this.marketingToolsRef}
                                    className={`nav-link dropdown-toggle ${isActive ? 'active' : ''}`}
                                    href="#" 
                                    onClick={this.toggleMarketingDropdown}
                                    role="button"
                                    aria-haspopup="true"
                                    aria-expanded={showMarketingDropdown}>
                                    {this.getMenuDisplayName(menu.Key)}
                                </a>
                                <div 
                                    ref={this.dropdownMenuRef}
                                    className={`dropdown-menu ${showMarketingDropdown ? 'show' : ''}`} 
                                    style={{ 
                                        position: 'absolute', 
                                        fontSize: '0.9rem',
                                        left: `${dropdownLeftPosition}px`
                                    }}>
                                    {menu.Submenus.map((submenu, subIndex) => {
                                        const submenuActive = this.isMenuActive(submenu.Controller);
                                        const submenuKey = submenu.Controller.toLowerCase();
                                        return (
                                            <a 
                                                key={subIndex}
                                                className={`dropdown-item ${submenuActive ? 'active' : ''}`}
                                                href={`/portal/${submenuKey}`}
                                                onMouseEnter={() => this.prefetchPage(submenuKey)}
                                                onTouchStart={() => this.prefetchPage(submenuKey)}>
                                                {submenu.DisplayName}
                                            </a>
                                        );
                                    })}
                                </div>
                            </li>
                        );
                    } else {
                        const isActive = this.isMenuActive(menu.Key);
                        const menuKey = menu.Key.toLowerCase();
                        return (
                            <li key={index} className="nav-item">
                                <a 
                                    className={`nav-link ${isActive ? 'active' : ''}`}
                                    href={`/portal/${menuKey}`}
                                    onMouseEnter={() => this.prefetchPage(menuKey)}
                                    onTouchStart={() => this.prefetchPage(menuKey)}>
                                    {this.getMenuDisplayName(menu.Key)}
                                </a>
                            </li>
                        );
                    }
                })}
            </ul>
        );
    }
}

