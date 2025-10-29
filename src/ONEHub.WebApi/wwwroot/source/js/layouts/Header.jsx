import React, { PureComponent } from 'react';
import { post } from '../modules/ajaxRequest';

export default class Header extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: this.formatTime(new Date())
        };
    }

    componentDidMount() {
        this.clockInterval = setInterval(() => {
            this.setState({ currentTime: this.formatTime(new Date()) });
        }, 1000);
    }

    componentWillUnmount() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
        }
    }

    formatTime = (date) => {
        const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000) + (8 * 3600000));
        
        const hours = String(utcDate.getHours()).padStart(2, '0');
        const minutes = String(utcDate.getMinutes()).padStart(2, '0');
        const seconds = String(utcDate.getSeconds()).padStart(2, '0');
        
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[utcDate.getMonth()];
        const day = utcDate.getDate();
        const year = utcDate.getFullYear();
        
        return `${hours}:${minutes}:${seconds} ${month} ${day}, ${year} GMT`;
    }

    handleLogout = async (e) => {
        e.preventDefault();
        try {
            // Call backend logout endpoint to clear session and cookies
            await post('auth/logout', {});
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Redirect to login page (HttpOnly cookies cleared by server)
            window.location.href = '/portal/login';
        }
    }

    handleChangePassword = (e) => {
        e.preventDefault();
        window.location.href = '/portal/home#/change-password';
    }

    render() {
        const { userName, siteName } = this.props;
        const logoUrl = `/dist/imgs/theme/${siteName}.png`;

        return (
            <div className="headWrapper">
                <div className="float-left logo">
                    <img src={logoUrl} alt={siteName} />
                </div>
                <div className="float-left user-info">
                    <span className="font-weight-bold icon-top">
                        Welcome, {userName}
                    </span>
                    <a className="text-redlink btn-changePassword" href="#" onClick={this.handleChangePassword}>
                        Change Password
                    </a>
                    <a className="text-redlink btn-logout" href="#" onClick={this.handleLogout}>
                        Logout
                    </a>
                </div>

                <div className="float-right clock-container">
                    <span className="oi oi-clock"></span>
                    <span id="clock">{this.state.currentTime}</span> +8
                </div>
            </div>
        );
    }
}

