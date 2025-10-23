import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import reducer from './reducers';
import AppContainer from './components/AppContainer';
import { configureStore } from '../../modules/store';
import { headerText, defaultColumns } from './libs/constants';
import { convertListToMutilpleSelected, handleChangeMultipleSelected, convertArrayToObjectProps } from '../../modules/utils';
import ClaimPrincipal from '../../modules/claim';

export default class App extends Component {
    constructor(props) {
        super(props);

        const { commGroupList, languageList, groupId, param, targetCountryList } = window.initialState;
        const claimsPrincipal = ClaimPrincipal.currentClaimPrincipal;

        let newCommGroupList = convertListToMutilpleSelected(commGroupList, 'GroupId', 'GroupName');

        if (!!groupId) {
            newCommGroupList = handleChangeMultipleSelected(newCommGroupList, groupId.toString());
        }

        const newTargetCountryList = convertArrayToObjectProps(targetCountryList, 'TargetCountryCode', 'TargetCountryName');
        const newLanguageList = convertArrayToObjectProps(languageList, 'LanguageCode', 'LanguageName');

        const filteredColumnList = Object.keys(headerText).filter(c => !defaultColumns.includes(c)).filter(c => !headerText[c].renderClaim || claimsPrincipal.hasClaim(headerText[c].renderClaim));
        const columnList = filteredColumnList.map(item => {
            return {
                columnKey: item,
                columnName: headerText[item].label,
                checked: true
            }
        });

        this.store = configureStore({ languageList: newLanguageList, commGroupList: newCommGroupList, groupId, param, columnList, claimsPrincipal, targetCountryList: newTargetCountryList }, reducer);

    }

    render() {
        return (
            <Provider store={this.store}>
                <AppContainer />
            </Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"))