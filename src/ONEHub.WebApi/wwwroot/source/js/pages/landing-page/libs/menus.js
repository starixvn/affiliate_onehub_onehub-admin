import React from 'react'
import { Claim, claimResource } from '../../../modules/claim';
import { menuKey, relativePath } from '../libs/constants';

const PageManagement = React.lazy(() => import('../page-management/index'));
const PageBuilder = React.lazy(() => import('../page-builder/index'));
const AssetUploader = React.lazy(() => import('../asset-uploader/index'));
const FormManagement = React.lazy(() => import('../form-management/index'));

export const menus = [
    { key: menuKey.pageManagement, label: 'Page Management', href: relativePath.pageManagement, component: PageManagement, renderClaim: new Claim(claimResource.PageManagement) },
    { key: menuKey.pageBuilder, label: 'Page Builder', href: relativePath.pageBuilder, component: PageBuilder, renderClaim: new Claim(claimResource.PageManagement) },
    { key: menuKey.assetUploader, label: 'Asset Uploader', href: relativePath.assetUploader, component: AssetUploader, renderClaim: new Claim(claimResource.AssetUploader) },
    { key: menuKey.formManagement, label: 'Registration Form Management', href: relativePath.formManagement, component: FormManagement, renderClaim: new Claim(claimResource.RegistrationFormUploader) },
]
