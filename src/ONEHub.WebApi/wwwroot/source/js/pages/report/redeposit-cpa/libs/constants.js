
export const NA = 'N/A';
export const totalText = 'Total (all pages)';

export const reportKey = {
    RowIdx: 'RowIdx',
    AffUserName: 'AffUserName',
    DealName: 'DealName',
    PaymentFrequency: 'PaymentFrequency',
    CpaPaymentDetails: 'CpaPaymentDetails',
    StartFromStr: 'StartFromStr',
    ApprovalDateStr: 'ApprovalDateStr',
    RecheckDays: 'RecheckDays',
    ExpiredRedepositDateStr: 'ExpiredRedepositDateStr',
    RedepositStatistics: 'RedepositStatistics',
    ApprovedCpaPlayer: 'ApprovedCpaPlayer',
    RedepositRate: 'RedepositRate',
    NumOfPlayerRedeposit: 'NumOfPlayerRedeposit',
    TotalSettledCpaAmount: 'TotalSettledCpaAmount',
    Status: 'Status'
}

export const headerText = {
    [reportKey.RowIdx]: '#',
    [reportKey.AffUserName]: 'Affiliate',
    [reportKey.DealName]: 'Deal Name',
    [reportKey.PaymentFrequency]: 'Payment Frequency',
    [reportKey.CpaPaymentDetails]: 'CPA Payment Details',
    [reportKey.StartFromStr]: 'Start From',
    [reportKey.ApprovalDateStr]: 'Approval Date',
    [reportKey.RecheckDays]: 'Re-check Days',
    [reportKey.ExpiredRedepositDateStr]: 'Expired Redeposit Date',
    [reportKey.RedepositStatistics]: 'Redeposit Statistics',
    [reportKey.ApprovedCpaPlayer]: 'Approved CPA Player',
    [reportKey.RedepositRate]: 'Redeposit %',
    [reportKey.NumOfPlayerRedeposit]: 'No. of Player Redeposit',
    [reportKey.TotalSettledCpaAmount]: 'Total Settled CPA Amount',
    [reportKey.Status]: 'Status'
}

export const headerConfigs = {
    [reportKey.RowIdx]: { label: headerText[reportKey.RowIdx], width: 50 },
    [reportKey.AffUserName]: { label: headerText[reportKey.AffUserName], width: 150 },
    [reportKey.DealName]: { label: headerText[reportKey.DealName], width: 250 },
    [reportKey.PaymentFrequency]: { label: headerText[reportKey.PaymentFrequency], width: 120 },
    [reportKey.CpaPaymentDetails]: {
        label: headerText[reportKey.CpaPaymentDetails],
        cols: {
            [reportKey.StartFromStr]: { label: headerText[reportKey.StartFromStr], width: 120 },
            [reportKey.ApprovalDateStr]: { label: headerText[reportKey.ApprovalDateStr], width: 120 },
            [reportKey.RecheckDays]: { label: headerText[reportKey.RecheckDays], width: 120 },
            [reportKey.ExpiredRedepositDateStr]: { label: headerText[reportKey.ExpiredRedepositDateStr], width: 120 },
        }
    },
    [reportKey.RedepositStatistics]: {
        label: headerText[reportKey.RedepositStatistics],
        cols: {
            [reportKey.ApprovedCpaPlayer]: { label: headerText[reportKey.ApprovedCpaPlayer], width: 120 },
            [reportKey.RedepositRate]: { label: headerText[reportKey.RedepositRate], width: 120 },
            [reportKey.NumOfPlayerRedeposit]: { label: headerText[reportKey.NumOfPlayerRedeposit], width: 120 },
        }
    },

    [reportKey.TotalSettledCpaAmount]: { label: headerText[reportKey.TotalSettledCpaAmount], width: 120 },
    [reportKey.Status]: { label: headerText[reportKey.Status], width: 150 }
}

export const resource = {
    reportName: 'REDEPOSIT CPA REPORT',
    space: ' '
}