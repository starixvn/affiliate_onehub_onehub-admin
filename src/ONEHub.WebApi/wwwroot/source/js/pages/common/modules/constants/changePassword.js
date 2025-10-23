export const regExp = {
    CheckPassword: "^(?=.*[0-9]+.*[0-9]+)(?=.*[a-zA-Z].*[a-zA-Z]).{6,}$"
}

export const messages = {
    RequiredPassword: "New Password is required!",
    RequiredConfirmPassword: "Confirm Password is required!",
    ChangePasswordSuccess: "Change password successfully!",
    PasswordErrorMessage: 'Password must have at least 6 characters, including at least 2 letters and at least 2 digits.',
    ConfirmPasswordErrorMessage: 'Confirm Password is not correct!',
    ChangePasswordFailed: 'Change password is failed!'
}

export const resource = {
    ChangePassword: 'Change Password',
    Password: 'Password',
    ConfirmPassword: 'Confirm Password',
    Submit: "Submit",
    Cancel: "Cancel",
}