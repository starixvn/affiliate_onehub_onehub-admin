import React, { useEffect, useState } from 'react';
import { post } from '@/modules/ajaxRequest';
import { batch, useDispatch, useSelector } from 'react-redux';
import { handleChangeMultipleSelected } from '@/modules/utils';
import { ActionCreators } from '../actions';
import { defaultState } from '../constants/settings';
import { apiUrl } from '../constants/api';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
    const {
        setSelectedStatus,
        setStatusList,
        setParam,
        setSearchCampaign,
        setSearchDescription
    } = ActionCreators;
    const [dashboardData, setDashboardData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [statusList, param] = useSelector(state => [state.statusList, state.param]);

    useEffect(() => {
        const controller = new AbortController();
        let isMounted = true;
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const response = await post(apiUrl.getDashboard, {}, { signal: controller.signal });
                if (isMounted) {
                    setDashboardData(response.data);
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Fetch failed:", err);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchDashboardData();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [param]);

    const {
        TotalCampaigns = 0,
        ActiveCampaigns = 0,
        DraftCampaigns = 0,
        PausedCampaigns = 0,
        InactiveCampaigns = 0
    } = dashboardData || {};

    const statsCards = [
        {
            status: 'Total',
            value: TotalCampaigns,
            icon: '📊',
            type: 'total',
            filterValue: '-1'
        },
        {
            status: 'Active',
            value: ActiveCampaigns,
            icon: '✅',
            type: 'active',
            filterValue: '1'
        },
        {
            status: 'Draft',
            value: DraftCampaigns,
            icon: '✏️',
            type: 'draft',
            filterValue: '0'
        },
        {
            status: 'Paused',
            value: PausedCampaigns,
            icon: '⏸️',
            type: 'paused',
            filterValue: '2'
        },
        {
            status: 'Inactive',
            value: InactiveCampaigns,
            icon: '🗑️',
            type: 'inactive',
            filterValue: '3'
        }
    ];

    const handleCardClick = (value) => {
        if (!isLoading) {
            if (!!value && value === '-1') {
                value = statusList.map(item => item.key).join(',');
            }
            batch(() => {
                dispatch(setSelectedStatus(value));
                dispatch(setStatusList(handleChangeMultipleSelected(statusList, value)));
                dispatch(setSearchCampaign(""));
                dispatch(setSearchDescription(""));
                dispatch(setParam({ ...defaultState, StatusIds: value, RequestId: uuidv4() }));
            });
        }
    };

    const LoadingSpinner = () => (
        <div className="loading-spinner">
            <div className="spinner-circle"></div>
        </div>
    );

    return (
        <div className="campaign-dashboard">
            <div className="dashboard-header">
                <h2 className="title">Campaign Dashboard</h2>

                <div className="cards-container">
                    {statsCards.map((card, index) => (
                        <div
                            key={index}
                            className={`dashboard-card dashboard-card--${card.type} ${isLoading ? 'dashboard-card--loading' : ''}`}
                            onClick={() => handleCardClick(card.filterValue)}
                            style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                        >
                            <div className="card-icon">
                                {card.icon}
                            </div>
                            <div className="card-info">
                                <div className="card-title">
                                    <strong>{card.status}</strong>
                                    <br />
                                    Campaigns
                                </div>
                                <div className="card-value">
                                    {isLoading ? <LoadingSpinner /> : card.value}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
