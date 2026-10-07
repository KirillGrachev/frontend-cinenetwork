
export const auth = {
    register: 'Sign Up',
    login: 'Sign In',
    email: 'Email',
    password: 'Password',
    passwordHint: 'Must be at least 8 characters',
    confirmPassword: 'Confirm Password',
    agree: 'By clicking "Sign Up", you agree to our',
    userAgreement: 'User Agreement',
    privacyPolicy: 'Privacy Policy',
    forgotPassword: 'Forgot password?',
    socialLogin: 'or',
    haveAccount: 'Already have an account?',
    noAccount: "Don't have an account?",
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    formErrors: {
      required: 'Empty',
      invalidEmail: 'Invalid email format',
      passwordTooShort: 'Password is too short',
      passwordsDoNotMatch: 'Passwords do not match',
      invalidCode: 'Code must be 6 digits',
    },
    formSuccess: {
      registerSuccess: 'Code sent to email',
      resetSuccess: 'Password successfully changed',
      verifySuccess: 'Email verified. Welcome!',
    },
    recovery: {
        title: 'Reset Password',
        step1Desc: 'Enter the email associated with your account. We will send a reset code.',
        step2Desc: 'Enter the 6-digit code sent to {email}',
        step3Desc: 'Create a new secure password.',
        sendCode: 'Send Code',
        verifyCode: 'Verify Code',
        resetPass: 'Change Password',
        resendCode: 'Resend Code',
        resendIn: 'in {seconds}s',
        backToLogin: 'Back to Login'
    },
    verify: {
        title: 'Verify Email',
        description: 'We sent a verification code to {email}. Enter it below.',
        submit: 'Verify',
        codePlaceholder: '000000',
    }
};
