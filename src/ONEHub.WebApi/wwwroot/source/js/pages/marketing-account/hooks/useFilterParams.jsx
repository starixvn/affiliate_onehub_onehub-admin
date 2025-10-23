import { useState } from 'react';
import { allStatuses } from '../libs/constants';

const defaultFilterParams = {
    languageCode: '',
    targetCountryCode: '',
    status: allStatuses,
    userName: ''
}

export default function useFilterParams() {
    const [filterParams, setFilterParams] = useState(defaultFilterParams);
    const onChangeFilterParams = (key, value) => {
        setFilterParams(prevState => ({
            ...prevState,
            [key]: value
        }));
    }

    return {
        onChangeFilterParams,
        filterParams
    }
}