import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Button } from 'reactstrap';

import { countDownList, TenSeconds, SixtySeconds } from '../libs/constants';
import { getOnlineList } from '../actions';

export class Filter extends PureComponent {
    constructor(props) {
        super(props);

        this.countDownDropdown = React.createRef();

        this.state = {
            isChangingCountDown: false,
            selectedCountDown: SixtySeconds,
            countDown: SixtySeconds,
            time: '00:60'
        };
    }

    componentDidMount() {
        this.internal = window.setInterval(this._handleCountDown, 1000);
    }

    componentWillUnmount() {
        window.clearInterval(this.interval);
    }

    _handleCountDown = () => {
        const { countDown, selectedCountDown } = this.state;

        if (countDown >= 1 || selectedCountDown != 0) {
            const time = countDown ? countDown - 1 : selectedCountDown - 1;
            let min = Math.floor(time / SixtySeconds);
            let sec = time % SixtySeconds;
            min = (min < TenSeconds ? "0" + min : min);
            sec = (sec < TenSeconds ? "0" + sec : sec);

            !countDown && this._handleFetchData();

            this.setState({ countDown: time, time: min + ":" + sec });
        } else {
            this.setState({ time: '' });
        }
    }

    _handleFetchData = async () => {
        const { pagingOption } = this.props;

        await this.props.getOnlineList({ pageIndex: 1, pageSize: pagingOption.PageSize });
    }

    _toggleChangingCountDown = (isChanging) => {
        this.setState({ isChangingCountDown: isChanging }, () => isChanging && this.countDownDropdown.current.focus());
    }

    _handleChangeCountDown = async (event) => {
        const value = event.target.value;

        this.setState({ selectedCountDown: value, countDown: value });

        this._handleFetchData();
    }

    render() {
        const { isChangingCountDown, selectedCountDown, time } = this.state;
        return (
            <div className="filter-container">
                <Row>
                    <Col><span className="text-primary"><strong>Online List</strong></span></Col>
                    <Col className="text-right text-primary">
                        <select style={{ display: isChangingCountDown ? 'inline-block' : 'none' }} value={selectedCountDown}
                            onChange={this._handleChangeCountDown} onBlur={() => this._toggleChangingCountDown(false)} ref={this.countDownDropdown}>
                            {
                                Object.keys(countDownList).map(key => {
                                    return (<option value={key} key={`count-down-${key}`}>{countDownList[key]}</option>)
                                })
                            }
                        </select>
                        <Button color="link" className="home-btn-link" style={{ display: isChangingCountDown ? 'none' : 'inline-flex' }} onClick={() => this._toggleChangingCountDown(true)}>
                            {time} <span className="icontime"></span>
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps({ pagingOption }) {
    return Object.assign({}, { pagingOption });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getOnlineList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);