export const headerText = {
    Index: '#',
    CampaignCode: 'Campaign Code',
    CampaignName: 'Campaign Name',
    CampaignDescription: 'Campaign Description',
    CreatedDate: 'Created Date',
    CreatedBy: 'Created By',
    LastModifiedDate: 'Last Modified Date',
    LastModifiedBy: 'Last Modified By',
    Status: 'Status',
    Edit: 'Edit'
}

export const defaultState = {
    StatusIds: '',
    Search: '',
    Description: '',
    PageIndex: 1,
    PageSize: 20
}

export const statusOptions = [
    { value: '0', label: 'Draft', type: 'draft', className: 'status-select--draft' },
    { value: '1', label: 'Active', type: 'active', className: 'status-select--active' },
    { value: '2', label: 'Paused', type: 'paused', className: 'status-select--paused' },
    { value: '3', label: 'Inactive', type: 'inactive', className: 'status-select--inactive' }
];

export const confirmPopupContent = {
    title: "Confirm this Action",
    content: [
        "Only active campaigns are available for selection when creating a new landing page.",
        "Are you sure you want to change status of this campaign?"
    ]
}