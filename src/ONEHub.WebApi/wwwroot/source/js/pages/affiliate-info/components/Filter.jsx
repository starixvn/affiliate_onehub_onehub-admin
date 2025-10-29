import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MultipleSelect from '../../../components/multiple-select';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { handleChangeMultipleSelected } from '../../../modules/utils';
import { statusList, sortByList, defaultState, resource, allCommGroups } from '../libs/constants';
import { setReportTitle, setParam, setSelectedColumn, setParentAffName, setCommGroupList } from '../actions';

export class Filter extends Component {
    constructor(props) {
        super(props);

        const { groupId } = this.props;

        this.initialGroupId = groupId;

        this.state = {
            ...defaultState,
            selectedCommGroupList: groupId || allCommGroups,
            selectedStatus: props.param.Status || '',
            parentAffName: this.props.param.ParentAffName || '',
            affCategoryIds: "1"
        }
    }

    componentDidMount() {
        const { param } = this.props;

        if (this.initialGroupId !== 0 || param.IsFromHome) {
            this.handleClickSearch();
        }

        param.ParentAffName && this.handleClickSearch(param.ParentAffName);
    }

    componentDidUpdate(prevProps) {
        const { parentAffName } = this.props;

        if (parentAffName !== prevProps.parentAffName) {
            this.setState({ ...defaultState, parentAffName });
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChangeSortAscending = () => {
        this.setState((prevState) => ({ isSortAscending: !prevState.isSortAscending }));
    }

    handleChangeExcludeMarketingAccount = (e) => {
        const isExcludeMarketingAccount = e.target.checked;
        this.setState((prevState) => ({ affCategoryIds: isExcludeMarketingAccount ? "1" : "all" }));
    }

    handleChangeCommGroup = (item, selectedCommGroupList) => {
        this.setState({ selectedCommGroupList });

        this.props.setCommGroupList(handleChangeMultipleSelected(this.props.commGroupList, selectedCommGroupList));
    }

    handlePressEnter = (event) => {
        if (event.charCode === 13) {
            event.preventDefault();

            this.handleClickSearch();
        }
    }

    handleClickSearch = (parentAffName) => {

        const { selectedCommGroupList, selectedTargetCountry, selectedLanguage, selectedStatus, userName, email, selectedSortBy, isSortAscending, affCode, affPlayer, affCategoryIds } = this.state;

        const affCodeInput = affCode.trim();
        const isSelectAllCommGroup = this.props.commGroupList.every(c => c.checked);
        this.props.setReportTitle(this._buildReportTitle(selectedTargetCountry, selectedLanguage, selectedStatus, userName, email, affCodeInput, affPlayer, isSelectAllCommGroup));

        const param = {
            GroupIds: isSelectAllCommGroup ? allCommGroups : selectedCommGroupList,
            TargetCountryCode: selectedTargetCountry,
            Language: selectedLanguage,
            Status: selectedStatus,
            ParentAffName: parentAffName || this.state.parentAffName,
            UserName: userName,
            Email: email,
            SortBy: selectedSortBy,
            SortDirectionType: !isSortAscending,
            AffCode: affCodeInput,
            AffPlayer: affPlayer,
            AffCategoryIds: affCategoryIds
        }
        this.props.setParam(param);
    }

    handleChangeColumn = (item, selectedColumn) => {
        const { columnList } = this.props;
        const selectedColumnList = selectedColumn.split(',').filter(p => !!p);

        const newColumnList = columnList.map(item => {
            const { columnKey, columnName } = item;
            const checked = selectedColumnList.indexOf(columnKey) !== -1;

            return {
                columnKey,
                columnName,
                checked
            };
        })

        this.props.setSelectedColumn(newColumnList);
    }

    _buildReportTitle(selectedTargetCountry, selectedLanguage, selectedStatus, userName, email, affCode, affPlayer, isSelectAllCommGroup) {
        const { commGroupList, languageList, targetCountryList } = this.props;

        const space = resource.Space;
        const apostrophe = resource.Apostrophe;
        const commGroupTitle = isSelectAllCommGroup ? resource.AllCommGroups : commGroupList.filter(c => c.checked).map(c => c.name).join(',');
        const languageTitle = languageList[selectedLanguage] || resource.AllLanguages;
        const statusTitle = statusList[selectedStatus] || resource.AllStatuses;
        const targetCountryTitle = targetCountryList[selectedTargetCountry] || resource.AllTargetCountries;

        const userNameTitle = userName && space + resource.UsernameContains + apostrophe + userName + apostrophe;
        const emailTitle = email && space + resource.EmailContains + apostrophe + email + apostrophe;
        const affCodeTitle = affCode && space + resource.AffCodeContains + apostrophe + affCode + apostrophe;
        const affPlayerTitle = affPlayer && space + resource.AffPlayerContains + apostrophe + affPlayer + apostrophe;

        return `${resource.ReportName}${space}${commGroupTitle.toUpperCase()}${space}${targetCountryTitle.toUpperCase()}${space}${languageTitle.toUpperCase()}${space}${statusTitle.toUpperCase()}`
            + `${userNameTitle}${emailTitle}${affCodeTitle}${affPlayerTitle}`;
    }

    render() {
        const { selectedLanguage, selectedSortBy, selectedStatus, isSortAscending, userName, email, affCode, parentAffName, affPlayer, selectedTargetCountry, affCategoryIds } = this.state;
        const { commGroupList, languageList, columnList, targetCountryList } = this.props;

        return (
            <div className="filter-container">
                <Form inline tag="div">
                    <FormGroup className="my-2 mr-sm-2">
                        <Label htmlFor="SearchBy" className="mr-sm-2">{resource.SearchBy}</Label>
                        <MultipleSelect
                            dataSource={commGroupList}
                            keyField="key"
                            valueField="name"
                            statusField="checked"
                            maxDisplayItemCount={1}
                            selectedAllLabel="All Revenue Groups"
                            onChange={this.handleChangeCommGroup} />
                    </FormGroup>

                    <FormGroup className="my-2 mr-sm-2">
                        {
                            <Input type="select" name="selectedTargetCountry" id="targetCountry" value={selectedTargetCountry} onChange={this.handleChange}>
                                <option key="target-country-all" value="">{resource.AllTargetCountries}</option>
                                {
                                    Object.keys(targetCountryList).map(country => {
                                        return (<option key={'country-' + country} value={country}>{targetCountryList[country]}</option>)
                                    })
                                }
                            </Input>
                        }
                    </FormGroup>

                    <FormGroup className="my-2 mr-sm-2">
                        {
                            <Input type="select" name="selectedLanguage" id="language" value={selectedLanguage} onChange={this.handleChange}>
                                <option key="lang-all" value="">{resource.AllLanguages}</option>
                                {
                                    Object.keys(languageList).map(lang => {
                                        return (<option key={'lang-' + lang} value={lang}>{languageList[lang]}</option>)
                                    })
                                }
                            </Input>
                        }
                    </FormGroup>

                    <FormGroup className="my-2 mr-sm-2">
                        {
                            <Input type="select" name="selectedStatus" id="status" value={selectedStatus} onChange={this.handleChange}>
                                <option key="status-all" value="">{resource.AllStatuses}</option>
                                {
                                    Object.keys(statusList).map(status => {
                                        return (<option key={'status-' + status} value={status}>{statusList[status]}</option>)
                                    })
                                }
                            </Input>
                        }
                    </FormGroup>

                    <FormGroup className="my-2 mr-sm-2">
                        <Input type="text" name="parentAffName" id="parentAffName" value={parentAffName} placeholder="Parent Affiliate"
                            onKeyPress={this.handlePressEnter}
                            onChange={(e) => this.props.setParentAffName(e.target.value)} />
                    </FormGroup>

                    <FormGroup className="my-2 mr-sm-2">
                        <Input type="text" name="userName" id="username" placeholder="Username" value={userName}
                            onKeyPress={this.handlePressEnter}
                            onChange={this.handleChange} />
                    </FormGroup>

                    <FormGroup className="my-2 mr-sm-2">
                        <Input type="email" name="email" id="email" placeholder="Email" value={email}
                            onKeyPress={this.handlePressEnter}
                            onChange={this.handleChange} />
                    </FormGroup>

                    <FormGroup className="my-2 mr-sm-2">
                        <Input type="text" name="affCode" id="affCode" placeholder="Affiliate Code" value={affCode}
                            onKeyPress={this.handlePressEnter}
                            onChange={this.handleChange} />
                    </FormGroup>

                    <FormGroup className="my-2 mr-sm-2">
                        <Input type="text" name="affPlayer" id="affPlayer" placeholder="Affiliate Player" value={affPlayer}
                            onKeyPress={this.handlePressEnter}
                            onChange={this.handleChange} />
                    </FormGroup>

                    <FormGroup className="my-2 mr-sm-2">
                        <Label htmlFor="SortBy" className="mr-sm-2">{resource.SortBy}</Label>
                        <Input type="select" name="selectedSortBy" id="SortBy" value={selectedSortBy} onChange={this.handleChange} >
                            {
                                Object.keys(sortByList).map(sortBy => {
                                    return (<option key={'sortBy-' + sortBy} value={sortByList[sortBy]}>{sortBy}</option>)
                                })
                            }
                        </Input>
                    </FormGroup>

                    <FormGroup className="my-2 mr-sm-2">
                        <Label check>
                            {resource.AZ}
                            <Input className="ml-1" type="checkbox" checked={isSortAscending} onChange={this.handleChangeSortAscending} />
                        </Label>
                    </FormGroup>

                    <FormGroup className="my-2 mr-sm-2">
                        <Label htmlFor="SortBy" className="mr-sm-2">{resource.DisplayedColumns}</Label>
                        <MultipleSelect
                            dataSource={columnList}
                            keyField="columnKey"
                            valueField="columnName"
                            statusField="checked"
                            maxDisplayItemCount={1}
                            selectedAllLabel="All"
                            onChange={this.handleChangeColumn} />
                    </FormGroup>
                    <FormGroup className="my-2 mr-sm-2">
                        <Label check>
                            {resource.ExcludeMarketingAccount}
                            <Input className="ml-1" type="checkbox" checked={affCategoryIds === "1"} onChange={(e) => this.handleChangeExcludeMarketingAccount(e)} />
                        </Label>
                    </FormGroup>
                    <Button className="my-2" outline color="primary" type="button" onClick={() => this.handleClickSearch(parentAffName)} >
                        <span className="oi oi-magnifying-glass"></span> {resource.Search}
                    </Button>
                </Form>
            </div>
        );
    }
}

function mapStateToProps({ languageList, commGroupList, param, groupId, columnList, parentAffName, targetCountryList }) {
    return Object.assign({}, { languageList, commGroupList, param, groupId, columnList, parentAffName, targetCountryList });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setReportTitle, setParam, setSelectedColumn, setParentAffName, setCommGroupList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);