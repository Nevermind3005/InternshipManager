export const BASE_URL = import.meta.env.VITE_API_BASE;

export const API = {
    Endpoints: {
        Auth: {
            Login: () => 'Auth/login',
            RegisterStudent: () => 'Auth/register/student',
            RefreshToken: () => 'Auth/refreshToken',
            ChangeDefaultPassword: () => 'Auth/changeDefaultPassword',
            CreateInternshipHandler: () => 'Auth/register/internshipHandler',
            RegisterRepresentative: () => 'Auth/register/representative',
            Logout: () => 'Auth/logout'
        },
        Internship: {
            Create: () => 'Internship',
            GetAll: () => 'Internship',
            GetById: (id: string) => `Internship/${id}`,
            Update: (id: string) => `Internship/${id}`,
            ViewById: (id: string, token: string) => `PublicInternship/view/${id}?token=${encodeURIComponent(token)}`,
            Approve: (id: string, token: string) => `PublicInternship/view/${id}/approve?token=${encodeURIComponent(token)}`,
            Decline: (id: string, token: string) => `PublicInternship/view/${id}/decline?token=${encodeURIComponent(token)}`
        },
        Company: {
            Create: () => 'Company',
            GetById: (id: string) => `Company/${id}`,
            GetAll: () => 'Company',
            GetRepresentativeByEmail: (id: string, email: string) => `Company/${id}/representative/${email}`
        }
    }
};