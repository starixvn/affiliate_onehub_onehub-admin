import React, { PureComponent } from 'react';

export default class AppLayout extends PureComponent {
  render() {
    return (
      <div className="body-container">
        <div className="main-container">
          <div className="app-container">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}