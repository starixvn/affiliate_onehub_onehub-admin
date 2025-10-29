export const _formatDealText = (deal, isExcludeDeal, dealList) => {

    if ((isExcludeDeal && deal === '') || deal === '0') {
        return { dealStr: 'All Deals', deal: 'Applied To: All Deals' };
    }

    if (!isExcludeDeal && !deal) {
        return { dealStr: '', deal: '' };
    }

    const dealNames = deal.split(',')
        .map(id => dealList.find(item => item.GroupId === Number(id))?.GroupName || '')
        .filter(Boolean);

    const dealCount = dealNames.length;
    const dealStr = dealNames.join(', ');
    const text = dealCount > 2
        ? (isExcludeDeal ? `<strong style="color: royalblue;">Applied To All Deals Except: ${dealCount}</strong>` : `<strong style="color: royalblue;">Applied To: ${dealCount}</strong>`)
        : (isExcludeDeal ? `Applied To All Deals Except: ${dealStr}` : `Applied To: ${dealStr}`);

    return { dealStr, deal: text };
}

export const _validateSelectedDealsByMode = (isExcluded, selectedDeals, filterDealMode) => {
    const isExcludeDeal = Number(isExcluded) === filterDealMode.Exclude;
    if (isExcludeDeal && selectedDeals === '0') {
        return 'Please deselect at least a deal.';
    }

    if (!isExcludeDeal && selectedDeals === '') {
        return 'Please select at least a deal.';
    }

    return '';
}

export const _handleInitialDealList = (dealList, selectedDeals = '') => {
    const selectedDealsArray = selectedDeals.split(',').filter(p => !!p);

    return dealList && dealList.map(item => {
        return {
            key: item.GroupId,
            name: item.GroupName,
            checked: selectedDeals === '0' ? true : selectedDealsArray.includes(item.GroupId.toString())
        }
    })
}