import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

const UserPanelBreadcrumb = (props) => {

    function _renderBreadcrumbItem(breadcrumbList) {
        const arrayItem = [];
        const lastIndex = breadcrumbList.length - 1;

        for (let i = 0; i < lastIndex; i++) {
            arrayItem.push(<BreadcrumbItem key={breadcrumbList[i].title}><a href="javascript:;" onClick={breadcrumbList[i].handleClick}>{breadcrumbList[i].title}</a></BreadcrumbItem>);
        }

        arrayItem.push(<BreadcrumbItem active key={breadcrumbList[lastIndex].title}>{breadcrumbList[lastIndex].title}</BreadcrumbItem>)

        return arrayItem;
    }

    const breadcrumbs = props.breadcrumbList || null;

    return breadcrumbs && (
        <Breadcrumb>
            {
                _renderBreadcrumbItem(breadcrumbs)
            }
        </Breadcrumb>
    );
}

export default React.memo(UserPanelBreadcrumb);