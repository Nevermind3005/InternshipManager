using Microsoft.AspNetCore.Mvc;

namespace server.Foundation.Result;

public static class ResultExtensions
{
    public static ObjectResult ToProblemDetails(this Result result)
    {
        var statusCode = MapErrorToStatusCode(result.Error);

        var problemDetails = new ProblemDetails
        {
            Title = result.Error.Key,
            Detail = result.Error.Description,
            Status = statusCode
        };

        return new ObjectResult(problemDetails)
        {
            StatusCode = statusCode
        };
    }
    
    private static int MapErrorToStatusCode(Error error) =>
        ErrorStatusMap.GetValueOrDefault(error.Key, StatusCodes.Status500InternalServerError);
    
    private static readonly Dictionary<string, int> ErrorStatusMap = new()
    {
        [Error.NotFound.Key] = StatusCodes.Status404NotFound,
        [Error.UserAlreadyExists.Key] = StatusCodes.Status400BadRequest,
        [Error.InvalidCredentials.Key] = StatusCodes.Status401Unauthorized,
        [Error.InvalidAuthToken.Key] = StatusCodes.Status401Unauthorized,
        [Error.BadRequest.Key] = StatusCodes.Status400BadRequest,
    };

}