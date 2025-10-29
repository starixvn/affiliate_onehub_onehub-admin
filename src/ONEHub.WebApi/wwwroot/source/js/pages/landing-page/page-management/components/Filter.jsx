import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';
import MultipleSelect from '../../../../components/multiple-select';
import { handleChangeMultipleSelected, convertListToMutilpleSelected } from '../../../../modules/utils';

import { setParam, setCampaignList, setDealList, setTargetCountryList, setLanguageList, setStatusList } from '../actions';
import { globalResource } from '../libs/constants';

export const Filter = ({ 
    targetCountryList, 
    languageList, 
    dealList, 
    statusList, 
    pagingOption, 
    campaignList,
    setParam,
    setCampaignList,
    setDealList,
    setTargetCountryList,
    setLanguageList,
    setStatusList
}) => {
    const [filters, setFilters] = useState({
        landingPageName: '',
        campaignName: '',
        dealIds: 'all',
        targetCountryCodes: 'all',
        languageCodes: 'all',
        statusIds: 'all'
    });

    useEffect(() => {
        const loadFilters = async () => {
            if (targetCountryList?.length > 0) return;

            if (!window.initialState?.filtersLoaded) {
                await window.pageInitializer.initLandingPage();
            }

            const { 
                targetCountryList: tcList = [], 
                allLanguagesInSystem = [], 
                dealList: dList = [], 
                statusList: sList = [], 
                campaignList: cList = [] 
            } = window.initialState;

            const newTargetCountryList = convertListToMutilpleSelected(tcList, 'TargetCountryCode', 'TargetCountryName');
            const newLanguageList = convertListToMutilpleSelected([...new Map(allLanguagesInSystem.map(item => [item.LanguageCode, item])).values()], 'LanguageCode', 'LanguageName');
            const newDealList = convertListToMutilpleSelected(dList, 'GroupId', 'GroupName');
            const newStatusList = convertListToMutilpleSelected(sList, 'StatusId', 'Status');
            const newCampaignList = convertListToMutilpleSelected(cList, 'CampaignId', 'CampaignName');

            setTargetCountryList(newTargetCountryList);
            setLanguageList(newLanguageList);
            setDealList(newDealList);
            setStatusList(newStatusList);
            setCampaignList(newCampaignList);

            setFilters({
                landingPageName: '',
                campaignName: '',
                dealIds: newDealList.filter(item => item.checked).map(item => item.key).join(','),
                targetCountryCodes: newTargetCountryList.filter(item => item.checked).map(item => item.key).join(','),
                languageCodes: newLanguageList.filter(item => item.checked).map(item => item.key).join(','),
                statusIds: newStatusList.filter(item => item.checked).map(item => item.key).join(',')
            });
        };

        loadFilters();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChangeDeal = (item, selectedDealList) => {
        setFilters({ ...filters, dealIds: selectedDealList });
        setDealList(handleChangeMultipleSelected(dealList, selectedDealList));
    };

    const handleChangeTargetCountry = (item, selectedTargetCountryList) => {
        setFilters({ ...filters, targetCountryCodes: selectedTargetCountryList });
        setTargetCountryList(handleChangeMultipleSelected(targetCountryList, selectedTargetCountryList));
    };

    const handleChangeLanguage = (item, selectedLanguageList) => {
        setFilters({ ...filters, languageCodes: selectedLanguageList });
        setLanguageList(handleChangeMultipleSelected(languageList, selectedLanguageList));
    };

    const handleChangeStatus = (item, selectedStatusList) => {
        setFilters({ ...filters, statusIds: selectedStatusList });
        setStatusList(handleChangeMultipleSelected(statusList, selectedStatusList));
    };

    const handleSearch = () => {
        const { landingPageName, campaignName, dealIds, targetCountryCodes, languageCodes, statusIds } = filters;

        const isSelectAllDeals = dealList ? dealList.every(c => c.checked) : true;
        const isSelectAllTargetCountries = targetCountryList ? targetCountryList.every(c => c.checked) : true;
        const isSelectAllLanguages = languageList ? languageList.every(c => c.checked) : true;
        const isSelectAllStatuses = statusList ? statusList.every(c => c.checked) : true;

        const newParam = {
            landingPageName: landingPageName.trim(),
            campaignName: campaignName.trim(),
            dealIds: dealIds,//isSelectAllDeals ? 'all' : dealIds,
            targetCountryCodes: targetCountryCodes,//isSelectAllTargetCountries ? 'all' : targetCountryCodes,
            languageCodes: languageCodes,//isSelectAllLanguages ? 'all' : languageCodes,
            statusIds: statusIds,//isSelectAllStatuses ? 'all' : statusIds,
            PageIndex: 1,
            PageSize: pagingOption.PageSize,
            RequestId: uuidv4() // Add UUID for request tracking
        };
        setParam(newParam);
    };

    return (
        <div className="filter-container my-2 pb-0">
            <Form inline tag="div">
                <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter`}>
                    <Label htmlFor="campaignName" className="mr-sm-2">Campaign Name</Label>
                    <Input 
                        type="text" 
                        name="campaignName" 
                        id="campaignName" 
                        value={filters.campaignName} 
                        onChange={handleChange}
                        placeholder="Search campaign name"
                    />
                </FormGroup>
                <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter`}>
                    <Label htmlFor="landingPageName" className="mr-sm-2">Page Name</Label>
                    <Input 
                        type="text" 
                        name="landingPageName" 
                        id="landingPageName" 
                        value={filters.landingPageName} 
                        onChange={handleChange}
                        placeholder="Search page name"
                    />
                </FormGroup>

                <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter ${filters.targetCountryCodes ? '' : 'multiple-select-wrapper is-invalid'}`}>
                    <Label htmlFor="targetCountry" className="mr-sm-2">Target Country</Label>
                    <MultipleSelect
                        id="targetCountry"
                        dataSource={targetCountryList || []}
                        keyField="key"
                        valueField="name"
                        statusField="checked"
                        maxDisplayItemCount={1}
                        hasInputOption={true}
                        noneSelectedLabel="Please select"
                        selectedAllLabel="All"
                        onChange={handleChangeTargetCountry} />
                </FormGroup>

                <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter ${filters.languageCodes ? '' : 'multiple-select-wrapper is-invalid'}`}>
                    <Label htmlFor="language" className="mr-sm-2">Language</Label>
                    <MultipleSelect
                        id="language"
                        dataSource={languageList || []}
                        keyField="key"
                        valueField="name"
                        statusField="checked"
                        maxDisplayItemCount={1}
                        hasInputOption={true}
                        noneSelectedLabel="Please select"
                        selectedAllLabel="All"
                        onChange={handleChangeLanguage} />
                </FormGroup>

                <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter ${filters.dealIds ? '' : 'multiple-select-wrapper is-invalid'}`}>
                    <Label htmlFor="deal" className="mr-sm-2">Deal</Label>
                    <MultipleSelect
                        id="deal"
                        dataSource={dealList || []}
                        keyField="key"
                        valueField="name"
                        statusField="checked"
                        maxDisplayItemCount={1}
                        hasInputOption={true}
                        noneSelectedLabel="Please select"
                        selectedAllLabel="All"
                        onChange={handleChangeDeal} />
                </FormGroup>
                
                <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter ${filters.statusIds ? '' : 'multiple-select-wrapper is-invalid'}`}>
                    <Label htmlFor="status" className="mr-sm-2">Status</Label>
                    <MultipleSelect
                        id="status"
                        dataSource={statusList || []}
                        keyField="key"
                        valueField="name"
                        statusField="checked"
                        maxDisplayItemCount={1}
                        hasInputOption={true}
                        noneSelectedLabel="Please select"
                        selectedAllLabel="All"
                        onChange={handleChangeStatus} />
                </FormGroup>

                <Button outline color="primary" type="button" disabled={!filters.statusIds || !filters.dealIds || !filters.targetCountryCodes || !filters.languageCodes} className="mb-2" onClick={handleSearch}>
                    <span className="oi oi-magnifying-glass"></span> {globalResource.Search}
                </Button>
            </Form>
        </div>
    );
};

function mapStateToProps({ targetCountryList, languageList, dealList, statusList, pagingOption, campaignList }) {
    return {
        targetCountryList,
        languageList,
        dealList,
        statusList,
        pagingOption,
        campaignList
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        setParam, 
        setCampaignList, 
        setDealList, 
        setTargetCountryList, 
        setLanguageList, 
        setStatusList 
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Filter));