export const createMarketingAccount = async (data) => {
    const response = await post('Portal/MarketingAccount/CreateMarketingAccount', data);

    return response && response.status === 200 ? response.data : null;  
}

