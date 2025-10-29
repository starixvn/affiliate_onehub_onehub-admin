import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { ActionCreators } from '../actions';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { confirmPopupContent, defaultState } from '../constants/settings';
import { rootFolderOptions } from '../constants/settings';
import { showConfirmToast } from '@/pages/common/components/Toast';


const FilterForm = () => {
    const [assetInfo, setAssetInfo] = useState(defaultState);

    const {
        deleteAsset,
        setIsShowAssetModificationPopup } = ActionCreators;

    const dispatch = useDispatch();
    const handleChangeRootFolder = (event) => {
        setAssetInfo({ ...assetInfo, RootFolder: event.target.value });
    }

    const handleChangeSubPath = (event) => {
        setAssetInfo({ ...assetInfo, SubPath: event.target.value });
    }

    const handleChangeAssetName = (event) => {
        setAssetInfo({ ...assetInfo, FileName: event.target.value });
    }

    const handleDeleteAsset = () => {
        const params = {
            RootFolder: assetInfo.RootFolder,
            SubPath: assetInfo.SubPath,
            FileName: assetInfo.FileName,
            RequestId: uuidv4()
        }

        showConfirmToast({
            title: confirmPopupContent.title,
            content: confirmPopupContent.content,
            onConfirm: () => dispatch(deleteAsset(params)),
            onCancel: () => { },
            cancelText: "Cancel",
            submitText: "Yes"
        });
    }

    // const handleUploadAssets = () => {
    //     dispatch(setIsShowAssetModificationPopup(true));
    // }

    return (
        <div className="filter-container my-2 pb-0">
            <Form inline tag="div">
                <FormGroup className='mr-sm-3 pb-2'>
                    <Label htmlFor="rootFolder" className="mr-sm-2">Root Folder</Label>
                    <Input type="select" name="rootFolder" id="rootFolder" value={assetInfo.RootFolder} onChange={handleChangeRootFolder}>
                        {
                            rootFolderOptions && Object.keys(rootFolderOptions).map(key => (
                                <option key={`rootFolder-${key}`} value={key}>
                                    {rootFolderOptions[key]}
                                </option>
                            ))
                        }
                    </Input>
                </FormGroup>

                <FormGroup className="mr-sm-3 pb-2">
                    <Label htmlFor="subPath" className="mr-sm-2">Sub Path</Label>
                    <Input
                        type="text"
                        name="subPath"
                        id="subPath"
                        value={assetInfo.SubPath}
                        onChange={handleChangeSubPath}
                        placeholder="Sub path"
                        className="wide-input"
                    />
                </FormGroup>

                <FormGroup className="mr-sm-3 pb-2">
                    <Label htmlFor="assetName" className="mr-sm-2">Asset Name</Label>
                    <Input
                        type="text"
                        name="assetName"
                        id="assetName"
                        value={assetInfo.FileName}
                        onChange={handleChangeAssetName}
                        placeholder="Asset name"
                        className="wide-input"
                    />
                </FormGroup>

                <div className="button-group">
                    <Button outline color="primary" type="button" className="mb-2 mr-2" onClick={handleDeleteAsset} disabled={!assetInfo.RootFolder || !assetInfo.SubPath || !assetInfo.FileName}>
                        <span className="oi oi-magnifying-glass"></span> Delete Asset
                    </Button>

                    {/* <Button color="success" type="button" className="mb-2" onClick={handleUploadAssets}>
                        <span className="oi oi-plus"></span> Add Assets
                    </Button> */}
                </div>
            </Form>
        </div>
    );
};

export default FilterForm;
