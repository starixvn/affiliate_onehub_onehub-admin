import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';

import { headerTitle, globalResource, maxWidth } from '../modules/constants';
import { setSelectedPage, toggleLoaderUserPanel, fetchData } from '../actions';
import { htmlDecode } from '../../../../modules/htmlHelper';

export class Content extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gridData: null
        }
    }

    componentDidUpdate(prevProps) {
        const { param } = this.props;

        if (param !== prevProps.param) {
            this.fetchData(this.props.param);
        }
    }

    async fetchData(param) {
        this.props.toggleLoaderUserPanel(true);

        const data = await this.props.fetchData(param);

        this.setState({ gridData: data });

        this.props.toggleLoaderUserPanel(false);
    }

    handleSelectedPage = (selectedPage, languageCode) => {
        const param = Object.assign({}, { selectedPage, languageCode });

        this.props.setSelectedPage(param);
    }

    _renderHeader() {
        return (
            <Row key="thead">
                <Cell header={true} colWidth={290} title={headerTitle.Page}>{headerTitle.Page}</Cell>
                <Cell header={true} colWidth={290} title={headerTitle.Language}>{headerTitle.Language}</Cell>
                <Cell header={true} colWidth={110} title={headerTitle.TotalClick}>{headerTitle.TotalClick}</Cell>
                <Cell header={true} colWidth={110} title={headerTitle.UniqueClick}>{headerTitle.UniqueClick}</Cell>
                <Cell header={true} colWidth={110} title={headerTitle.Signups}>{headerTitle.Signups}</Cell>
                <Cell header={true} colWidth={110} title={headerTitle.Fdm}>{headerTitle.Fdm}</Cell>
            </Row>
        );
    }

    _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList.length) {
            const { languageList } = this.props
            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];
                dataRows.push(this._buildDataRow(dataItem, languageList, i));
            }
        }
        else {
            dataRows.push(
                <Row key="no-info">
                    <Cell className="text-center" colSpan="6">{globalResource.NoInfo}</Cell>
                </Row>
            );
        }

        return dataRows;
    }

    _buildDataRow(dataItem, languageList, index) {
        const language = languageList[dataItem.LanguageCode] || dataItem.LanguageCode;
        const page = htmlDecode(dataItem.Page);
        return (
            <Row key={`dataRow-${index}`}>
                <Cell title={page}>
                    {page && (page.toLowerCase() === "old url" || page.toLowerCase() === "none") ? page :
                        (<Button color="link" className="p-0" onClick={() => this.handleSelectedPage(dataItem.Page, dataItem.LanguageCode)}>
                            {page}
                        </Button>)}
                </Cell>
                <Cell title={language} className="text-right">{language}</Cell>
                <Cell title={dataItem.TotalClick} className="text-right">{dataItem.TotalClick}</Cell>
                <Cell title={dataItem.UniqueClick} className="text-right">{dataItem.UniqueClick}</Cell>
                <Cell title={dataItem.Signups} className="text-right">{dataItem.Signups}</Cell>
                <Cell title={dataItem.Fdm} className="text-right">{dataItem.Fdm}</Cell>
            </Row>
        )
    }

    render() {
        const { gridData } = this.state;

        return gridData && (
            <div className="table-responsive table-striped my-2">
                <Table
                    maxWidth={maxWidth}
                    bodyHeight={300}
                    header={this._renderHeader()}
                    body={this._renderDataSection(gridData)}
                    containerPadding={10}
                />
            </div>
        );
    }
}


function mapStateToProps({ landingPageStatistics, languageList }) {
    const { param } = landingPageStatistics;

    return Object.assign({}, { param, languageList });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoaderUserPanel, setSelectedPage, fetchData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);