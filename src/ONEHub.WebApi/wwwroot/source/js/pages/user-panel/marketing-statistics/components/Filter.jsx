import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { DatePicker } from '@9softstudio/react-datepicker';

import { globalResource } from '../../../../modules/globalResource';
import { setParam } from '../actions';
import { minDate } from '../../../../modules/constants';
import { getDateRange, formatUnit } from '../../../../modules/utils';

export const Filter = (props) => {

    const { today } = props;

    const now = new Date(today);
    const nowDay = now.getDate();
    const nowMonth = now.getMonth() + 1;
    const nowString = `${formatUnit(nowMonth)}/${formatUnit(nowDay)}/${now.getFullYear()}`;

    const [date, setDate] = useState({ fromDate: `${formatUnit(nowMonth)}/01/${now.getFullYear()}`, toDate: nowString });
    const [languageCodes, setLanguageCodes] = useState('');
    const [includedInActive, setIncludedInActive] = useState(false);

    const _handleChangeDate = (momentDate, type) => {
        setDate(prev => {
            if (type === 'from') {
                const { fromDate, toDate } = getDateRange(momentDate, prev.toDate);
                return { ...prev, fromDate, toDate };
            }
            return { ...prev, toDate: momentDate.format('MM/DD/YYYY') };
        });
    }

    const _handleSearch = () => {
        const param = Object.assign({}, {
            affId: props.affId,
            fromDate: date.fromDate,
            toDate: date.toDate,
            languageCodes: languageCodes,
            includedInActive,
        });

        props.setParam(param);
    }

    return (
        <div className="filter-container py-0">
            <Form inline tag="div">
                <FormGroup className="mr-sm-2 my-2">
                    <Label className="mr-sm-2">{globalResource.From}</Label>
                    <DatePicker minDate={minDate}
                        maxDate={nowString}
                        date={date.fromDate}
                        iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                        onChange={(momentDate) => _handleChangeDate(momentDate, 'from')} />
                </FormGroup>
                <FormGroup className="mr-sm-2 my-2">
                    <Label className="mr-sm-2">{globalResource.To}</Label>
                    <DatePicker minDate={date.fromDate}
                        maxDate={nowString}
                        date={date.toDate}
                        iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                        onChange={(momentDate) => _handleChangeDate(momentDate, 'to')} />
                </FormGroup>
                <FormGroup className="mr-sm-2 my-2">
                    <Label htmlFor="languageCode" className="mr-sm-2">Language</Label>
                    <Input type="select" name="languageCode" id="languageCode"
                        value={languageCodes}
                        onChange={(e) => setLanguageCodes(e.target.value)}>
                        <option value="">{globalResource.All}</option>
                        {
                            Object.keys(props.languageList).map(key => {
                                return (<option key={`language-${key}`} value={key}>{props.languageList[key]}</option>)
                            })
                        }
                    </Input>
                </FormGroup>
                <FormGroup className="mr-sm-2 my-2">
                    <Label check>
                        Include Inactive Tracking Link
                        <Input name="includedInActive" className="ml-1" type="checkbox"
                            checked={includedInActive}
                            onChange={e => setIncludedInActive(e.target.checked)} />
                    </Label>
                </FormGroup>
                <FormGroup className="mr-sm-2 my-2">
                    <Button outline className="mr-sm-2" color="primary" type="button" onClick={_handleSearch}>
                        <span className="oi oi-magnifying-glass"></span> {globalResource.Search}
                    </Button>
                </FormGroup>
            </Form>
        </div>
    );
}

function mapStateToProps({ today, affCommonInfo, languageList }) {
    const { affId } = affCommonInfo;
    return {
        affId,
        today,
        languageList
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setParam
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Filter));