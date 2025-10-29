import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { resetUserPanel } from '../actions';

export class UserPanelItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.props.resetUserPanel(this.props.name);
    }

    render() {
        const { PageComponent, name, ...maintainProps } = this.props;

        return (<PageComponent {...maintainProps} />);
    }
}

export const withUserPanel = (PageComponent, name) => {

    function mapStateToProps(state) {
        return { PageComponent, name }
    }

    function mapDispatchToProps(dispatch) {
        return bindActionCreators({ resetUserPanel }, dispatch);
    }

    return connect(mapStateToProps, mapDispatchToProps)(UserPanelItem);
}