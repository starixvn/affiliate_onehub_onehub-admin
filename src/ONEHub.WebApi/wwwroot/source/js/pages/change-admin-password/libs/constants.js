export const regExp = {
    CheckPassword: "^(?=.*[0-9]+.*[0-9]+)(?=.*[a-zA-Z].*[a-zA-Z]).{6,}$"
}

export const messages = {
    RequiredOldPassword: "Old Password is required!",
    RequiredNewPassword: "New Password is required!",
    RequiredConfirmPassword: "Confirm Password is required!",
    PasswordIncorrect: 'Password must have at least 6 characters, including at least 2 letters and at least 2 digits.',
    ConfirmPasswordIncorrect: 'Confirm Password is incorrect!',
    ChangePasswordSuccess: "Change password is successful!",
    ChangePasswordFailed: 'Change password is failed!'
}

export const initialState = {
    isClickedSubmit: false,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    isShowMessage: false,
    isSuccess: true,
    message: ''
};