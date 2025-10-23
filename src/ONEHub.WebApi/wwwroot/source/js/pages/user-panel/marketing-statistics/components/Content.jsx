import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';

import { fetchData, toggleLoaderUserPanel } from '../actions';
import { globalResource, headerTitle, maxWidth } from '../modules/constants';
import { format } from '../../../../modules/numberFormat';

export const Content = (props) => {
    const [gridData, setGridData] = useState(null);
    const [expandedChannels, setExpandedChannels] = useState({});
    const [shouldResetScrollPosition, setShouldResetScrollPosition] = useState(true);

    useEffect(() => {
        _fetchData(props.param);
    }, [props.param]);

    const _fetchData = async (param) => {
        if (!param) return;

        props.toggleLoaderUserPanel(true);

        const data = await props.fetchData(param);

        setExpandedChannels({});
        setShouldResetScrollPosition(true);
        setGridData(data);
        props.toggleLoaderUserPanel(false);
    }

    const _toggleChannel = (channelName) => {
        setExpandedChannels(prev => ({
            ...prev,
            [channelName]: !prev[channelName]
        }));
        setShouldResetScrollPosition(false);
    };

    const _calculateChannelTotal = (channelGroup) => {
        const total = { TotalClick: 0, UniqueClick: 0, Signups: 0, Fdm: 0 };
        for (const item of channelGroup) {
            total.TotalClick += item.TotalClick || 0;
            total.UniqueClick += item.UniqueClick || 0;
            total.Signups += item.Signups || 0;
            total.Fdm += item.Fdm || 0;
        }
        return total;
    };

    const _renderCells = (data, isChannel = false) => {
        const webUrl = data.WebsiteUrl || 'none';
        const marketName = data.MarketName || 'none';
        const totalClick = format(data.TotalClick);
        const uniqueClick = format(data.UniqueClick);
        const signups = format(data.Signups);
        const fdm = format(data.Fdm);

        return (
            <>
                <Cell title={isChannel ? data.index : ''} className="text-center">{isChannel ? data.index : ''}</Cell>
                <Cell title={isChannel ? data.ChannelName : webUrl} className={!isChannel ? 'pl-4' : ''}>
                    {isChannel ? (
                        <div className="p-0 th-wrapper" onClick={() => _toggleChannel(data.ChannelName)}>
                            <strong>{data.ChannelName}</strong>
                            <div className="icon-container">
                                <span className={`caret ${expandedChannels[data.ChannelName] ? 'expand current' : 'collapsed'}`}></span>
                            </div>
                        </div>
                    ) : webUrl}
                </Cell>
                <Cell title={isChannel ? '-' : marketName} className='text-center'>{isChannel ? '-' : marketName}</Cell>
                <Cell title={totalClick} className="text-right">{totalClick}</Cell>
                <Cell title={uniqueClick} className="text-right">{uniqueClick}</Cell>
                <Cell title={signups} className="text-right">{signups}</Cell>
                <Cell title={fdm} className="text-right">{fdm}</Cell>
            </>
        )
    };

    const _renderHeader = () => (
        <Row key="thead">
            <Cell header={true} colWidth={30} title='#'>#</Cell>
            <Cell header={true} colWidth={290} title={headerTitle.Channel}>{headerTitle.Channel}</Cell>
            <Cell header={true} colWidth={150} title={headerTitle.Language}>{headerTitle.Language}</Cell>
            <Cell header={true} colWidth={110} title={headerTitle.TotalClick}>{headerTitle.TotalClick}</Cell>
            <Cell header={true} colWidth={110} title={headerTitle.UniqueClick}>{headerTitle.UniqueClick}</Cell>
            <Cell header={true} colWidth={110} title={headerTitle.Signups}>{headerTitle.Signups}</Cell>
            <Cell header={true} colWidth={110} title={headerTitle.Fdm}>{headerTitle.Fdm}</Cell>
        </Row>
    );

    const _renderNoData = () => (
        <Row>
            <Cell colSpan="7" className="text-center">{globalResource.NoInfo}</Cell>
        </Row>
    );

    const _renderDataSection = () => {
        if (!gridData?.length) return _renderNoData();

        return gridData.map((channelGroup, groupIndex) => {
            const channelTotals = _calculateChannelTotal(channelGroup);
            const channel = {
                ...channelGroup[0],
                index: groupIndex + 1,
                ...channelTotals
            };
            return (
                <Fragment key={`channel-${groupIndex}`}>
                    <Row>
                        {_renderCells(channel, true)}
                    </Row>
                    {expandedChannels[channel.ChannelName] && channelGroup.map((link, linkIndex) => (
                        <Row key={`link-${linkIndex}`}>
                            {_renderCells(link)}
                        </Row>
                    ))}
                </Fragment>
            );
        });
    };

    return gridData && (
        <div className='data-content marketing-statistics'>
            <div className="table-responsive table-striped my-2">
                <Table
                    maxWidth={maxWidth}
                    bodyHeight={300}
                    header={_renderHeader()}
                    body={_renderDataSection()}
                    containerPadding={10}
                    shouldResetScrollPosition={shouldResetScrollPosition}
                />
            </div>
        </div>
    );
}

const mapStateToProps = ({ marketingStatistics, languageList }) => ({
    param: marketingStatistics.param,
    languageList
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    toggleLoaderUserPanel,
    fetchData
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Content));