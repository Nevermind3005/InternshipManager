using server.Data;
using server.Entities;

namespace server.Services;

public interface IInternshipNotificationService
{
    Task NotifyStateChangeAsync(Internship internship, EInternshipState oldState, EInternshipState newState);
    Task NotifyInternshipCreatedAsync(Internship internship);
    Task NotifyInternshipUpdatedAsync(Internship internship);
}
