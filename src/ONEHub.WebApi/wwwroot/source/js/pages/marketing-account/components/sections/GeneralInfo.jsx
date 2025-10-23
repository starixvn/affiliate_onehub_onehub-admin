import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setAff } from '../../actions';
import RowField from './RowField';

export const GeneralInfo = (props) => {
    const { generalInfo, setGeneralInfo, aff } = props;

    const safeGeneralInfo = generalInfo || {};
    const safeAff = aff || {};
    const safeTargetCountryCodeList = props.targetCountryCodeList || {};
    const safeLanguageCodeList = props.languageCodeList || {};
    const safeDealOptionsList = props.dealOptionsList || {};

    const onChange = (e) => {
        setGeneralInfo({
            ...safeGeneralInfo,
            [e.target.name]: e.target.value
        });
    }

    const targetCountryCodeList = Object.keys(safeTargetCountryCodeList).map(key => {
        return {
            label: safeTargetCountryCodeList[key],
            value: key
        }
    })

    const languageCodeList = Object.keys(safeLanguageCodeList).map(key => {
        return {
            label: safeLanguageCodeList[key],
            value: key
        }
    })

    const dealOptions = Object.keys(safeDealOptionsList).map(key => {
        return {
            label: safeDealOptionsList[key],
            value: key
        }
    })

    return (
        <div style={{ paddingLeft: '10px' }}>
            <RowField
                label="Copy from Marketing account"
                name="marketingAccount"
                value={safeAff.affName}
                onChange={e => props.setAff(e.target.value)}
                disabled={true}
                labelProps={{ style: { paddingRight: '0px' } }}
            />
            <RowField
                label="Target Country"
                name="targetCountryCode"
                value={safeGeneralInfo.targetCountryCode}
                onChange={onChange}
                selectOptions={targetCountryCodeList}
            />
            <RowField
                label="Language"
                name="preferredLanguage"
                value={safeGeneralInfo.preferredLanguage}
                onChange={onChange}
                selectOptions={languageCodeList}
            />
            <RowField
                label="Deal Name"
                name="groupId"
                value={safeGeneralInfo.groupId}
                onChange={onChange}
                selectOptions={dealOptions}
            />
        </div>
    );
};

const mapStateToProps = ({ aff, languageCodeList, targetCountryCodeList, dealOptionsList }) => {
    return {
        aff,
        languageCodeList,
        targetCountryCodeList,
        dealOptionsList
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setAff
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(GeneralInfo));
