export const BASE_URL = import.meta.env.VITE_API_BASE;

export const API = {
    Endpoints: {
        Auth: {
            Login: () => 'Auth/login',
            RegisterStudent: () => 'Auth/register/student',
            RefreshToken: () => 'Auth/refreshToken',
            ChangeDefaultPassword: () => 'Auth/changeDefaultPassword',
            CreateInternshipHandler: () => 'Auth/register/internshipHandler',
            RegisterCompany: () => 'Auth/register/company',
            RegisterRepresentative: () => 'Auth/register/representative',
            Logout: () => 'Auth/logout',
            RequestPasswordReset: () => 'Auth/requestPasswordReset',
            ConfirmPasswordReset: () => 'Auth/confirmPasswordReset'
        },
        Internship: {
            Create: () => 'Internship',
            GetAll: () => 'Internship',
            GetById: (id: string) => `Internship/${id}`,
            Update: (id: string) => `Internship/${id}`,
            Approve: (id: string) => `Internship/${id}/approve`,
            Decline: (id: string) => `Internship/${id}/decline`,
            HandlerApprove: (id: string) => `Internship/${id}/handler/approve`,
            HandlerReject: (id: string) => `Internship/${id}/handler/reject`,
            HandlerPass: (id: string) => `Internship/${id}/handler/pass`,
            HandlerFail: (id: string) => `Internship/${id}/handler/fail`
        },
        Users: {
            PersonalInformation: () => 'User/me/personalInformation',
            PersonalInformationInternshipHandler: () => 'User/me/personalInformation/internshipHandler',
            PersonalInformationCompanyRepresentative: () => 'User/me/personalInformation/companyRepresentative',
            ChangePassword: () => 'User/me/changePassword'
        },
        Company: {
            Create: () => 'Company',
            GetById: (id: string) => `Company/${id}`,
            GetAll: () => 'Company',
            GetRepresentativeByEmail: (id: string, email: string) => `Company/${id}/representative/${email}`
        },
        OAuth: {
            CreateApplication: () => 'OAuth/createApplication',
            GetAllApplications: () => 'OAuth/applications',
            DeleteApplication: (id: string) => `OAuth/deleteApplication/${id}`
        },
        StudyProgram: {
            Create: () => 'StudyProgram',
            GetAll: () => 'StudyProgram',
            GetById: (id: string) => `StudyProgram/${id}`
        }
    }
};