import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';
import MultipleSelect from '../../../../components/multiple-select';
import { handleChangeMultipleSelected, convertListToMutilpleSelected } from '../../../../modules/utils';

import { setParam, setModuleList, setTargetCountryList, setLanguageList, setStatusList } from '../actions';
import { headerText } from '../libs/constants';
import { assetStatus, moduleTypes } from '../../libs/constants';
import { globalResource } from '../../../../modules/globalResource';

export const Filter = ({
    moduleList,
    targetCountryList,
    languageList,
    statusList,
    pagingOption, 
    setParam,
    setModuleList,
    setTargetCountryList,
    setLanguageList,
    setStatusList,
}) => {
    const [filters, setFilters] = useState({
        moduleIds: 'all',
        targetCountryCodes: 'all',
        languageCodes: 'all',
        status: assetStatus.active,
    });

    useEffect(() => {
        const loadFilters = async () => {
            if (targetCountryList?.length > 0) return;

            if (!window.initialState?.filtersLoaded) {
                await window.pageInitializer.initAssetUploader();
            }

            const { 
                moduleList: mList = [], 
                targetCountryList: tcList = [], 
                allLanguagesInSystem = [],
                statusList: sList = []
            } = window.initialState;

            const newModuleList = convertListToMutilpleSelected(mList.filter(item => item.ModuleType !== moduleTypes.Form && item.ModuleType !== moduleTypes.Link), 'ModuleId', 'ModuleName');
            const newTargetCountryList = convertListToMutilpleSelected(tcList, 'TargetCountryCode', 'TargetCountryName');
            const newLanguageList = convertListToMutilpleSelected([...new Map(allLanguagesInSystem.map(item => [item.LanguageCode, item])).values()], 'LanguageCode', 'LanguageName');

            setModuleList(newModuleList);
            setTargetCountryList(newTargetCountryList);
            setLanguageList(newLanguageList);
            setStatusList(sList);

            setFilters({
                moduleIds: newModuleList.filter(item => item.checked).map(item => item.key).join(',') || '',
                targetCountryCodes: newTargetCountryList.filter(item => item.checked).map(item => item.key).join(',') || 'all',
                languageCodes: newLanguageList.filter(item => item.checked).map(item => item.key).join(',') || 'all',
                status: assetStatus.active
            });
        };

        loadFilters();
    }, []);

    const handleSearch = useCallback(() => {
        const { moduleIds, targetCountryCodes, languageCodes, status } = filters;
        
        const isSelectAllTargetCountry = targetCountryList.every(c => c.checked);
        const isSelectAllLanguage = languageList.every(c => c.checked);

        const newParam = {
            ModuleIds: moduleIds,
            TargetCountryCodes: isSelectAllTargetCountry ? 'all' : targetCountryCodes,
            LanguageCodes: isSelectAllLanguage ? 'all' : languageCodes,
            Status: status,
            PageIndex: 1,
            PageSize: pagingOption.PageSize,
            RequestId: uuidv4()
        };

        setParam(newParam);
    }, [filters, pagingOption.PageSize, setParam]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        let newFilters = { ...filters, [name]: value };

        setFilters(newFilters);
    };

    const handleChangeModule = (item, selectedModuleList) => {
        setFilters({ ...filters, moduleIds: selectedModuleList });

        setModuleList(handleChangeMultipleSelected(moduleList, selectedModuleList));
    }

    const handleChangeTargetCountry = (item, selectedTargetCountryList) => {

        setFilters({ ...filters, targetCountryCodes: selectedTargetCountryList });

        setTargetCountryList(handleChangeMultipleSelected(targetCountryList, selectedTargetCountryList));
    }

    const handleChangeLanguage = (item, selectedLanguageList) => {
        setFilters({ ...filters, languageCodes: selectedLanguageList });

        setLanguageList(handleChangeMultipleSelected(languageList, selectedLanguageList));
    }

    return (
        <div className="filter-container my-2 pb-0">
            <Form inline tag="div">
                <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter ${filters.moduleIds ? '' : 'multiple-select-wrapper is-invalid'}`}>
                    <Label htmlFor="module" className="mr-sm-2">{headerText.Module}</Label>
                    <MultipleSelect
                        id="module"
                        dataSource={moduleList}
                        keyField="key"
                        valueField="name"
                        statusField="checked"
                        maxDisplayItemCount={1}
                        hasInputOption={true}
                        noneSelectedLabel="Please select"
                        selectedAllLabel="All"
                        onChange={handleChangeModule} />
                </FormGroup>
                <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter ${filters.targetCountryCodes ? '' : 'multiple-select-wrapper is-invalid'}`}>
                    <Label htmlFor="targetCountry" className="mr-sm-2">{headerText.TargetCountry}</Label>
                    <MultipleSelect
                        id="targetCountry"
                        dataSource={targetCountryList}
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
                    <Label htmlFor="language" className="mr-sm-2">{headerText.Language}</Label>
                    <MultipleSelect
                        id="language"
                        dataSource={languageList}
                        keyField="key"
                        valueField="name"
                        statusField="checked"
                        maxDisplayItemCount={1}
                        hasInputOption={true}
                        noneSelectedLabel="Please select"
                        selectedAllLabel="All"
                        onChange={handleChangeLanguage} />
                </FormGroup>

                <FormGroup className={`mr-sm-3 pb-2 multiple-currency-filter ${filters.status ? '' : 'multiple-select-wrapper is-invalid'}`}>
                    <Label htmlFor="status" className="mr-sm-2">Status</Label>
                    <Input type="select" name="status" id="status" value={filters.status} onChange={handleChange}>
                        <option value={assetStatus.all}>All</option>
                        {
                            statusList && statusList.map(item => (
                                <option key={`status-${item.StatusId}`} value={item.StatusId}>
                                    {item.Status}
                                </option>
                            ))
                        }
                    </Input>
                </FormGroup>

                <Button outline color="primary" type="button" disabled={!filters.moduleIds || !filters.targetCountryCodes || !filters.languageCodes || !filters.status} className="mb-2" onClick={handleSearch}>
                    <span className="oi oi-magnifying-glass"></span> {globalResource.Search}
                </Button>
            </Form>
        </div>
    );
};

function mapStateToProps({ moduleList, targetCountryList, languageList, pagingOption, statusList, setModuleList, setTargetCountryList, setLanguageList }) {
    return Object.assign({}, {
        moduleList, targetCountryList, languageList, pagingOption, statusList, setModuleList, setTargetCountryList, setLanguageList
    });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParam, setModuleList, setTargetCountryList, setLanguageList, setStatusList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Filter));