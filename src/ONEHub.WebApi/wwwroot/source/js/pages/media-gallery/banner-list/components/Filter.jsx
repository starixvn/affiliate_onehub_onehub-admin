import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { setParam, setParamFromHome, getSizeList, setDisableCurrency, getCategoryList } from '../actions';
import { headerText, Asian, Casino, Sportsbook } from '../libs/constants';
import { globalResource, deviceTypes, userTypeList, affiliateBanner, allUserType, UserType } from '../../common/libs/constants';

export class Filter extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            category: '',
            subCategory: '',
            language: '',
            currency: '',
            affType: Asian,
            deviceType: '',
            size: '',
            userType: allUserType
        }
    }

    componentDidMount() {
        const { paramFromHome } = this.props;

        if (paramFromHome && paramFromHome.IsFromHome) {
            this.setState({ userType: paramFromHome.UserType }, this._handleSearch);
            this.props.setDisableCurrency(paramFromHome.UserType == affiliateBanner);
            this.props.setParamFromHome({ IsFromHome: false });
        }
    }

    _handleChangeCategory = (event) => {
        const selectedCategory = event.target.value;

        const param = Object.assign({}, this.state, { category: selectedCategory, subCategory: '' });

        this.props.getSizeList(param);
        this.setState({ category: selectedCategory, subCategory: '' });
    }

    _handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        let param = Object.assign({}, this.state, { [name]: value });

        if (name === UserType) {
            param = { ...param, currency: '', category: '', subCategory: '' };

            this.props.setDisableCurrency(value == affiliateBanner);
            this.props.getCategoryList(value);
        }


        this.setState(param);
        this.props.getSizeList(param);
    }

    _handleSearch = () => {
        const { pagingOption } = this.props;

        const newParam = Object.assign({}, this.state, { PageIndex: 1, PageSize: pagingOption.PageSize });

        this.props.setParam(newParam);
    }

    render() {
        const { categoryList, subCategoryCasinoList, subCategorySportsbookList, languageList, currencyList, sizeList, affTypeList, isDisableCurrency } = this.props;
        const { category, subCategory, language, currency, affType, deviceType, size, userType } = this.state;
        const isCategoryCasino = category === Casino;
        const hasSubCategory = isCategoryCasino || category === Sportsbook;
        const subCategoryList = hasSubCategory ? (isCategoryCasino ? subCategoryCasinoList : subCategorySportsbookList) : null;

        return (
            <div className="filter-container my-2 pb-0">
                <Form inline tag="div">
                    <FormGroup className="mr-sm-3 pb-2">
                        <Label htmlFor="userType" className="mr-sm-2">{headerText.UserType}</Label>
                        <Input type="select" name="userType" id="userType" value={userType} onChange={this._handleChange}>
                            <option key={'userType-all'} value={allUserType}>{globalResource.All}</option>
                            {
                                Object.keys(userTypeList).map(key => {
                                    return (<option key={`userType-${key}`} value={key}>{userTypeList[key]}</option>)
                                })
                            }
                        </Input>
                    </FormGroup>
                    <FormGroup className="mr-sm-3 pb-2">
                        <Label htmlFor="category" className="mr-sm-2">{headerText.Category}</Label>
                        <Input type="select" name="category" id="category" value={category} onChange={this._handleChangeCategory}>
                            <option key={'category-all'} value="">{globalResource.All}</option>
                            {
                                categoryList && categoryList.map(item => {
                                    return (<option key={`category-${item.CategoryName}`} value={item.CategoryName}>{item.CategoryName}</option>)
                                })
                            }
                        </Input>
                    </FormGroup>
                    {
                        subCategoryList && (
                            <FormGroup className="mr-sm-3 pb-2">
                                <Label htmlFor="subCategory" className="mr-sm-2">{headerText.SubCategory}</Label>
                                <Input type="select" name="subCategory" id="subCategory" value={subCategory} onChange={this._handleChange}>
                                    <option key={'subCategory-all'} value="">{globalResource.All}</option>
                                    {
                                        subCategoryList.map(item => {
                                            return (<option key={`subCategory-${item.SubCategoryName}`} value={item.SubCategoryName}>{item.SubCategoryName}</option>)
                                        })
                                    }
                                </Input>
                            </FormGroup>
                        )
                    }
                    <FormGroup className="mr-sm-3 pb-2">
                        <Label htmlFor="language" className="mr-sm-2">{headerText.Language}</Label>
                        <Input type="select" name="language" id="language" value={language} onChange={this._handleChange}>
                            <option key={'language-all'} value="">{globalResource.All}</option>
                            {
                                languageList && languageList.map(item => {
                                    return (<option key={`language-${item.LanguageName}`} value={item.LanguageName}>{item.LanguageName}</option>)
                                })
                            }
                        </Input>
                    </FormGroup>
                    <FormGroup className="mr-sm-3 pb-2">
                        <Label htmlFor="currency" className="mr-sm-2">{headerText.Currency}</Label>
                        <Input type="select" name="currency" id="currency" value={currency} onChange={this._handleChange} disabled={isDisableCurrency}>
                            <option key={'currency-all'} value="">{globalResource.All}</option>
                            {
                                currencyList && currencyList.map(item => {
                                    return (<option key={`currency-${item.name}`} value={item.name}>{item.name}</option>)
                                })
                            }
                        </Input>
                    </FormGroup>
                    {
                        affTypeList && (
                            <FormGroup className="mr-sm-3 pb-2">
                                <Label htmlFor="affType" className="mr-sm-2">{headerText.AffType}</Label>
                                <Input type="select" name="affType" id="affType" value={affType} onChange={this._handleChange}>
                                    {
                                        affTypeList.map(item => {
                                            return (<option key={`affType-${item.key}`} value={item.key}>{item.name}</option>)
                                        })
                                    }
                                </Input>
                            </FormGroup>
                        )
                    }
                    <FormGroup className="mr-sm-3 pb-2">
                        <Label htmlFor="deviceType" className="mr-sm-2">{headerText.Device}</Label>
                        <Input type="select" name="deviceType" id="deviceType" value={deviceType} onChange={this._handleChange}>
                            <option key={'deviceType-all'} value="">{globalResource.All}</option>
                            {
                                Object.keys(deviceTypes).map(key => {
                                    return (<option key={`deviceType-${key}`} value={deviceTypes[key]}>{key}</option>)
                                })
                            }
                        </Input>
                    </FormGroup>
                    <FormGroup className="mr-sm-3 pb-2">
                        <Label htmlFor="size" className="mr-sm-2">{headerText.Size}</Label>
                        <Input type="select" name="size" id="size" value={size} onChange={(e) => this.setState({ size: e.target.value })}>
                            <option key={'size-all'} value="">{globalResource.All}</option>
                            {
                                sizeList && sizeList.map(item => {
                                    return (<option key={`size-${item.name}`} value={item.name}>{item.name}</option>)
                                })
                            }
                        </Input>
                    </FormGroup>
                    <Button outline color="primary" type="button" className="mb-2" onClick={this._handleSearch}>
                        <span className="oi oi-magnifying-glass"></span> {globalResource.Search}
                    </Button>
                </Form>
            </div>
        );
    }
}

function mapStateToProps({ categoryList, subCategoryCasinoList, subCategorySportsbookList, languageList, currencyList,
    sizeList, affTypeList, pagingOption, paramFromHome, isDisableCurrency }) {
    return Object.assign({}, {
        categoryList, subCategoryCasinoList, subCategorySportsbookList, languageList, currencyList,
        sizeList, affTypeList, pagingOption, paramFromHome, isDisableCurrency
    });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParam, setParamFromHome, getSizeList, setDisableCurrency, getCategoryList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);