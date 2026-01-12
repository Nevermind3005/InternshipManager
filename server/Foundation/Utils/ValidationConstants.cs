namespace server.Foundation.Utils;

/// <summary>
/// Shared validation constants for DTOs
/// </summary>
public static class ValidationConstants
{
    /// <summary>
    /// Password regex: min 8 chars, at least one uppercase, lowercase, number, and special character
    /// </summary>
    public const string PasswordRegex = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]).{8,}$";
    
    /// <summary>
    /// Phone regex: optional + prefix, 7-19 digits
    /// </summary>
    public const string PhoneRegex = @"^\+?[0-9]{7,19}$";
    
    /// <summary>
    /// Student email regex: name.surname@student.ukf.sk format
    /// </summary>
    public const string StudentEmailRegex = @"^[a-zá-ž]+\.[a-zá-ž]+(\d+)?@student\.ukf\.sk$";
}
