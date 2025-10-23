import React, { useEffect, useState } from 'react';
import { validationEmail } from '../libs/validation';
import { defaultAdditionalInfo, defaultGeneralInfo, defaultPaymentInfo, defaultPersonalInfo, defaultWebsiteInfo } from '../libs/constants';
import { getMarketingAccountInfo, createMarketingAccount, getPaymentMethod } from '../actions';

export default function useNewMarketingAccountData(
    affId, 
    toggleLoader
) {
    const [resultInfo, setResultInfo] = useState({
        isSuccess: true,
        isShowMessage: false,
        message: ''
    });

    const [generalInfo, setGeneralInfo] = useState(defaultGeneralInfo);
    const [personalInfo, setPersonalInfo] = useState(defaultPersonalInfo);
    const [additionalInfo, setAdditionalInfo] = useState(defaultAdditionalInfo);
    const [paymentInfo, setPaymentInfo] = useState(defaultPaymentInfo);
    const [websiteInfo, setWebsiteInfo] = useState(defaultWebsiteInfo);
    const [minimumPayment, setMinimumPayment] = useState(0);
    const [paymentMethods, setPaymentMethods] = useState([]);

    useEffect(() => {
        toggleLoader(true);
        _fetchPaymentMethod().finally(() => {
            toggleLoader(false);
        });
    }, []);

    const _fetchPaymentMethod = async () => {
        const response = await getPaymentMethod()();
        if (response) {
            setMinimumPayment(response.MinAmount);
            setPaymentMethods(response.PaymentMethods);
        }
    }

    useEffect(() => {
        if (!affId) {
            setGeneralInfo(prevState => ({
                ...prevState,
                hasData: false,
            }));
            return;
        }
        toggleLoader(true);
        _fetchData().finally(() => {
            toggleLoader(false);
        });

    }, [affId]);

    const _fetchData = async () => {
        const data = await getMarketingAccountInfo(affId);

        if (data) {
            setPersonalInfo(prev => ({
                ...prev,
                ...data.personalInfo,
            }));
            setAdditionalInfo(prev => ({
                ...prev,
                ...data.additionalInfo,
            }));
            setPaymentInfo(prev => ({
                ...prev,
                ...data.paymentInfo,
            }));
            setWebsiteInfo(prev => ({
                ...prev,
                ...data.websiteInfo,
            }));
            setGeneralInfo(prevState => ({
                ...prevState,
                ...data.generalInfo,
                hasData: true,
                groupId: data.generalInfo.groupId
            }));
        }
    };

    const notify = (errMsg, modalBodyRef, isSuccess = false) => {
        setResultInfo(prevState => ({
            ...prevState,
            isSuccess: isSuccess,
            isShowMessage: true,
            message: errMsg
        }));
        if (modalBodyRef?.current) {
            modalBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const handleSubmit = async (modalBodyRef, successCallback = null) => {
        const websiteInfoTrim = websiteInfo.hasWebSite ? { ...websiteInfo, noSiteDesc: '' } : { ...websiteInfo, siteUrl: '', moreSiteUrls: '' };

        const rawData = {
            ...generalInfo,
            ...personalInfo,
            ...additionalInfo,
            ...paymentInfo,
            ...websiteInfoTrim,
        };
        
        if(rawData.hasWebSite) {
            rawData.noSiteDesc = "";
        }
        else {
            rawData.siteUrl = "";
            rawData.moreSiteUrls = "";
        }

        if (!rawData.email) {
            notify('Email Address is required', modalBodyRef);
            return;
        }

        const emailResult = validationEmail(rawData.email, true);
        if(!emailResult.isValid) {
            notify(emailResult.message, modalBodyRef);
            return;
        }
        toggleLoader(true);
        const result = await createMarketingAccount(rawData);
        toggleLoader(false);

        if (!result.isSuccessful) {
            notify(result.message, modalBodyRef);
            return;
        }
        notify('Successfully added a new marketing account', modalBodyRef, true);
        if(successCallback) {
            successCallback();
        }
    };

    return {
        // State
        resultInfo,
        generalInfo,
        personalInfo,
        additionalInfo,
        paymentInfo,
        websiteInfo,
        minimumPayment,
        paymentMethods,

        // State setters
        setGeneralInfo,
        setPersonalInfo,
        setAdditionalInfo,
        setPaymentInfo,
        setWebsiteInfo,
        
        // Functions
        handleSubmit,
    };
}
