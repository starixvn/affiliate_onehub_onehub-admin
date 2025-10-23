import React, { PureComponent } from 'react';
import Header from './Header';
import MainMenu from './MainMenu';

export default class AppLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      menus: []
    };
    this.checkMenusInterval = null;
  }

  componentDidMount() {
    this.loadUserInfo();
    
    // Listen for menu updates
    window.addEventListener('menusLoaded', this.handleMenusLoaded);
    
    // Also poll for menus in case event fired before listener was attached
    this.checkMenusInterval = setInterval(() => {
      const initialState = window.initialState || {};
      const menus = initialState.menus || [];
      
      if (menus.length > 0 && menus.length !== this.state.menus.length) {
        this.setState({ menus });
        clearInterval(this.checkMenusInterval);
      }
    }, 100); // Check every 100ms
    
    // Stop polling after 5 seconds
    setTimeout(() => {
      if (this.checkMenusInterval) {
        clearInterval(this.checkMenusInterval);
      }
    }, 5000);
  }

  componentWillUnmount() {
    window.removeEventListener('menusLoaded', this.handleMenusLoaded);
    if (this.checkMenusInterval) {
      clearInterval(this.checkMenusInterval);
    }
  }

  handleMenusLoaded = (event) => {
    const menus = event.detail || [];
    this.setState({ menus });
    if (this.checkMenusInterval) {
      clearInterval(this.checkMenusInterval);
    }
  }

  loadUserInfo = () => {
    const initialState = window.initialState || {};
    const user = initialState.user || {};
    const siteName = initialState.siteName || '12bet';
    const menus = initialState.menus || [];

    this.setState({
      userInfo: {
        userName: user.userName || 'Admin',
        siteName: siteName
      },
      menus: menus
    });
  }

  render() {
    const { userInfo, menus } = this.state;

    if (!userInfo) {
      return <div>Loading...</div>;
    }

    return (
      <div className="body-container">
        <header className="header">
          <Header userName={userInfo.userName} siteName={userInfo.siteName} />
        </header>
        <div className="main-menu-container">
          <MainMenu menus={menus} />
        </div>
        <div className="main-container">
          <div className="app-container">
            {this.props.children}
          </div>
        </div>
        <footer className="footer" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '25px', textAlign: 'center' }}>
        </footer>
      </div>
    );
  }
}