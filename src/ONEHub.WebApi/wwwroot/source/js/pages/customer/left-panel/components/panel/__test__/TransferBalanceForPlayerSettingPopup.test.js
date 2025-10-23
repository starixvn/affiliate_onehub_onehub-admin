import React from 'react'
import { shallow } from 'enzyme'
import { TransferBalanceForPlayerSettingPopup } from '../TransferBalanceForPlayerSettingPopup'

describe('left panel - TransferBalanceForPlayerSettingPopup component - ', () => {
    const settingInfo = {
        IsDisabledTransfer: false,
        IsUnlimited: false,
        TransferLimit: 1000,
        PlayerCurrency: 'USD',
        PlayerUsername: 'Test'
    }

    const defaultProps = {
        affId: 123,
        affName: 'Abc',
        settingInfo
    }

    it('should render correctly', () => {
        const result = shallow(<TransferBalanceForPlayerSettingPopup {...defaultProps} />)

        expect(result).toMatchSnapshot()
    })

    it('should render correctly 2', () => {
        const props = {
            ...defaultProps, settingInfo: {
                IsDisabledTransfer: true,
                IsUnlimited: true,
                TransferLimit: 1000,
                PlayerCurrency: 'USD',
                PlayerUsername: 'Test'
            }
        }
        const result = shallow(<TransferBalanceForPlayerSettingPopup {...props} />)

        expect(result).toMatchSnapshot()
    })

    it('handleChange - should call setTransferLimit', () => {
        const result = shallow(<TransferBalanceForPlayerSettingPopup {...defaultProps} />)

        result.find('Input[type="text"]').simulate('change', { target: { value: '1234' } });

        expect(result.find('Input[type="text"]').props().value).toEqual('1,234')
    })

    it('handleChange - should not call setTransferLimit', () => {
        const result = shallow(<TransferBalanceForPlayerSettingPopup {...defaultProps} />)

        result.find('Input[type="text"]').simulate('change', { target: { value: '1234abc' } });

        expect(result.find('Input[type="text"]').props().value).toEqual('1,000')
    })

    it('handlePressEnter - should call preventDefault and handleSave with update is failed', () => {
        window.setTimeout = jest.fn(fn => fn instanceof Function && fn())
        const props = { ...defaultProps, updateTransferLimitSetting: jest.fn(() => ({ IsSuccessful: false })) }
        const event = { charCode: 13, preventDefault: jest.fn() }
        const result = shallow(<TransferBalanceForPlayerSettingPopup {...props} />)

        result.find('Input[type="text"]').simulate('keyPress', event);

        expect(event.preventDefault).toHaveBeenCalled()
        expect(props.updateTransferLimitSetting).toHaveBeenCalled()
    })

    it('handlePressEnter - should call preventDefault and handleSave with update successfully', () => {
        window.setTimeout = jest.fn(fn => fn instanceof Function && fn())
        const props = {
            ...defaultProps,
            updateTransferLimitSetting: jest.fn(() => ({ IsSuccessful: true })),
            getAffiliateInfo: jest.fn(), onClose: jest.fn(),
            settingInfo: {
                IsDisabledTransfer: true,
                IsUnlimited: true,
                TransferLimit: 100000000000,
                PlayerCurrency: 'USD',
                PlayerUsername: 'Test'
            }
        }
        const event = { charCode: 13, preventDefault: jest.fn() }
        const result = shallow(<TransferBalanceForPlayerSettingPopup {...props} />)

        result.find('Input[type="text"]').simulate('keyPress', event);

        expect(event.preventDefault).toHaveBeenCalled()
        expect(props.updateTransferLimitSetting).toHaveBeenCalled()
    })

    it('handlePressEnter - should call preventDefault and handleSave with invalid param', () => {
        window.setTimeout = jest.fn(fn => fn instanceof Function && fn())
        const props = {
            ...defaultProps,
            updateTransferLimitSetting: jest.fn(),
            settingInfo: {
                IsDisabledTransfer: false,
                IsUnlimited: false,
                TransferLimit: 0,
                PlayerCurrency: 'USD',
                PlayerUsername: 'Test'
            }
        }
        const event = { charCode: 13, preventDefault: jest.fn() }
        const result = shallow(<TransferBalanceForPlayerSettingPopup {...props} />)

        result.find('Input[type="text"]').simulate('keyPress', event);

        expect(event.preventDefault).toHaveBeenCalled()
        expect(props.updateTransferLimitSetting).not.toHaveBeenCalled()
    })

    it('handlePressEnter - should call preventDefault and handleSave with invalid param 2', () => {
        window.setTimeout = jest.fn(fn => fn instanceof Function && fn())
        const props = {
            ...defaultProps,
            updateTransferLimitSetting: jest.fn(),
            settingInfo: {
                IsDisabledTransfer: false,
                IsUnlimited: false,
                TransferLimit: '123abc',
                PlayerCurrency: 'USD',
                PlayerUsername: 'Test'
            }
        }
        const event = { charCode: 13, preventDefault: jest.fn() }
        const result = shallow(<TransferBalanceForPlayerSettingPopup {...props} />)

        result.find('Input[type="text"]').simulate('keyPress', event);

        expect(event.preventDefault).toHaveBeenCalled()
        expect(props.updateTransferLimitSetting).not.toHaveBeenCalled()
    })

    it('handlePressEnter - should not call preventDefault', () => {
        const event = { charCode: 123, preventDefault: jest.fn() }
        const result = shallow(<TransferBalanceForPlayerSettingPopup {...defaultProps} />)

        result.find('Input[type="text"]').simulate('keyPress', event);

        expect(event.preventDefault).not.toHaveBeenCalled()
    })

    it('setEnable - should be called', () => {
        const result = shallow(<TransferBalanceForPlayerSettingPopup {...defaultProps} />)

        result.find('Input[type="checkbox"]').at(0).simulate('change');

        expect(result.find('Input[type="checkbox"]').at(0).props().checked).toBeFalsy()
    })

    it('setIsUnlimited - should be called', () => {
        const result = shallow(<TransferBalanceForPlayerSettingPopup {...defaultProps} />)

        result.find('Input[type="checkbox"]').at(1).simulate('change');

        expect(result.find('Input[type="checkbox"]').at(1).props().checked).toBeTruthy()
    })
})