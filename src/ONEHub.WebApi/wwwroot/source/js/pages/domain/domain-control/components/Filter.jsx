import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import MultipleSelect from '../../../../components/multiple-select';

import { setSelectedTargetCountry, fetchData, setAffSubDomainList, setShouldResetScrollPosition } from '../actions';
import { headerText, globalResource } from '../libs/constants';

export const Filter = (props) => {
    const { targetCountryList, affSubDomainList } = props;
    const [targetCountry, setTargetCountry] = useState('');

    const _handleSearch = () => {
        props.setSelectedTargetCountry(targetCountry);
        props.fetchData(targetCountry, affSubDomainList);
    }

    const handleChangeSubDomain = (item, selectedSubDomains) => {
        props.setShouldResetScrollPosition(false);

        const selectedSubDomainList = selectedSubDomains.split(',').filter(p => !!p);

        const newSubDomainList = affSubDomainList.map(item => {
            const { columnKey, columnName } = item;
            const checked = selectedSubDomainList.indexOf(columnKey) !== -1;

            return {
                columnKey,
                columnName,
                checked
            };
        })

        props.setAffSubDomainList(newSubDomainList);
    }

    return targetCountryList && (
        <div className="filter-container my-2">
            <Form inline tag="div">
                <FormGroup className="mr-sm-2">
                    <Label className="mr-sm-2">{headerText.TargetCountry}</Label>
                    <Input type="select" name="targetCountry" value={targetCountry} onChange={(e) => setTargetCountry(e.target.value)}>
                        <option key={'targetCountry-all'} value={''}>{globalResource.All}</option>
                        {
                            targetCountryList.map(item => {
                                return (<option key={`targetCountry-${item.TargetCountryCode}`} value={item.TargetCountryCode}>{item.TargetCountryName}</option>)
                            })
                        }
                    </Input>
                </FormGroup>
                <FormGroup className="mr-sm-3">
                    <Label className="mr-sm-2">{headerText.AffSubDomain}</Label>
                    <MultipleSelect
                        dataSource={affSubDomainList}
                        keyField="columnKey"
                        valueField="columnName"
                        statusField="checked"
                        maxDisplayItemCount={1}
                        noneSelectedLabel="Please Select"
                        selectedAllLabel="All"
                        onChange={handleChangeSubDomain} />
                </FormGroup>
                <Button outline color="primary" type="button" onClick={_handleSearch}>
                    <span className="oi oi-magnifying-glass"></span> {globalResource.Search}
                </Button>
            </Form>
        </div>
    )
}

function mapStateToProps({ targetCountryList, affSubDomainList }) {
    return Object.assign({}, { targetCountryList, affSubDomainList });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedTargetCountry, fetchData, setAffSubDomainList, setShouldResetScrollPosition }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Filter));