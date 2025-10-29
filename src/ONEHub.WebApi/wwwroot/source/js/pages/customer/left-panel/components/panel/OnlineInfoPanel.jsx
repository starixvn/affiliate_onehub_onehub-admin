import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Panel from '../Panel';
import { Row, Col } from 'reactstrap';

import { resource, messages } from '../../libs/constants';
import { toggleLoaderLeftPanel, getOnLineList } from '../../actions';

export class OnlineInfoPanel extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            onlineInfoList: null
        }
    }

    componentDidMount() {
        this.handleGetOnLineList(this.props.affName);
    }

    componentDidUpdate(prevProps) {
        const { affName } = this.props;

        if (affName !== prevProps.affName) {
            this.handleGetOnLineList(affName);
        }
    }

    async handleGetOnLineList(affName) {
        this.props.toggleLoaderLeftPanel(true);

        const data = await this.props.getOnLineList(affName);

        this.setState({ onlineInfoList: data });

        this.props.toggleLoaderLeftPanel(false);
    }

    _renderOnlineList = () => {
        const { onlineInfoList } = this.state;

        if (onlineInfoList && onlineInfoList.length) {
            return (
                onlineInfoList.map((item, index) => {
                    return (
                        <Row className="mr-0" key={`onl-info-${index}`}>
                            <Col sm={2} className="text-center pr-0">{index + 1}</Col>
                            <Col sm={5} className="text-center px-0">
                                <a target="_blank" href={`http://anonym.to/?http://legacytools.dnsstuff.com/tools/ipall.ch?tool_id=67&token=&toolhandler_redirect=0&ip=${item.Ip}&j=1`}>
                                    {item.Ip}
                                </a>
                            </Col>
                            <Col sm={5} className="text-center px-0">{item.ReloadTimeText}</Col>
                        </Row>
                    );
                })
            );
        } else {
            return (
                <Row className="mr-0">
                    <Col sm={12} className="text-center">{messages.userNotOnline}</Col>
                </Row>
            )
        }
    }

    render() {
        return (
            <Panel heading={resource.CurrentOnlineList} style={{ overflow: 'auto', maxHeight: 125 }}>
                <Row className="mr-0">
                    <Col sm={2} className="text_bold text-center pr-0">{resource.Index}</Col>
                    <Col sm={5} className="text_bold text-center px-0">{resource.Ip}</Col>
                    <Col sm={5} className="text_bold text-center px-0">{resource.LastCheckIn}</Col>
                </Row>

                {
                    this._renderOnlineList()
                }
            </Panel>
        );
    }
}

function mapStateToProps({ leftPanel }) {
    const { affiliateInfo, affName } = leftPanel;

    return Object.assign({}, { affiliateInfo, affName });
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoaderLeftPanel, getOnLineList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OnlineInfoPanel);