import React, { Suspense, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AppLayout from '../../../layouts/AppLayout';
import UserPanelSubMenu from '../../common/components/UserPanelSubMenu';

import { setSelectedSubNote, resetSubNote } from './actions';

import { menuList } from './libs/menu';

export const App = (props) => {
    const { selectedSubNote, claimsPrincipal, setSelectedSubNote, resetSubNote } = props;

    useEffect(() => {
        if (!selectedSubNote) {
            const firstMenu = menuList.find(m => m.renderClaim == undefined || claimsPrincipal.hasClaim(m.renderClaim));

            firstMenu && setSelectedSubNote(firstMenu.key);
        }
    });

    const filterByClaimMenuList = menuList.filter(m => m.renderClaim == undefined || claimsPrincipal.hasClaim(m.renderClaim));
    const selectedSubMenu = filterByClaimMenuList.find(p => p.key === selectedSubNote);
    const SubNoteComponent = !selectedSubMenu ? null : selectedSubMenu.component;

    const subMenuList = filterByClaimMenuList.map(m => {
        return {
            isActive: m.key == selectedSubNote,
            handleClick: () => {
                resetSubNote(selectedSubNote);
                setSelectedSubNote(m.key);
            },
            title: m.label
        }
    });

    return (
        <AppLayout>
            <UserPanelSubMenu subMenuList={subMenuList} />
            {
                SubNoteComponent &&
                <Suspense fallback={null}>
                    <SubNoteComponent />
                </Suspense>
            }
        </AppLayout>
    );
}

function mapStateToProps({ note, claimsPrincipal }) {
    const { selectedSubNote } = note;
    return Object.assign({}, { selectedSubNote, claimsPrincipal });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedSubNote, resetSubNote }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(App));