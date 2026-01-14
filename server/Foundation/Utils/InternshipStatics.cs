using server.Data;

namespace server.Foundation.Utils;

public class InternshipStatics
{
    public static bool IsStateChangeAllowed(EInternshipState currentState, EInternshipState newState, ERole editor)
    {
        return (currentState, newState, editor) switch
        {
            // Company confirm created internship (Created -> Confirmed)
            (EInternshipState.Created, EInternshipState.Confirmed, ERole.CompanyRepresentative) => true,
            // Company reject created internship (Created -> Rejected)
            (EInternshipState.Created, EInternshipState.Rejected, ERole.CompanyRepresentative) => true,

            // Handler approve confirmed internship (Confirmed -> Approved)
            (EInternshipState.Confirmed, EInternshipState.Approved, ERole.InternshipHandler) => true,
            // Handler reject confirmed internship (Confirmed -> Rejected)
            (EInternshipState.Confirmed, EInternshipState.Rejected, ERole.InternshipHandler) => true,
            // Handler pass approved internship (Approved -> Passed)
            (EInternshipState.Approved, EInternshipState.Passed, ERole.InternshipHandler) => true,
            // Handler fail approved internship (Approved -> Failed)
            (EInternshipState.Approved, EInternshipState.Failed, ERole.InternshipHandler) => true,
            
            // External application pass internship (Approved -> Passed)
            (EInternshipState.Approved, EInternshipState.Passed, ERole.ExternalApplication) => true,

            // Other action are invalid
            _ => false
        };
    }
}