namespace server.Foundation.Result;

public class Result
{
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public Error Error { get; }

    protected Result(bool isSuccess, Error error)
    {
        if (isSuccess && error != Error.None || !isSuccess && error == Error.None)
        {
            throw new ArgumentException("Invalid error", nameof(error));
        }
        IsSuccess = isSuccess;
        Error = error;
    }

    public static Result Success() => new(true, Error.None);
    public static Result Failure(Error error) => new(false, error);
}

public class Result<T> : Result
{
    private readonly T? _value;
    
    private Result(bool isSuccess, Error error, T? value = default)
        : base(isSuccess, error)
    {
        _value = value;
    }
    
    public T Value => IsSuccess
        ? _value!
        : throw new InvalidOperationException("Cannot access Value when result is a failure.");
    
    public static Result<T> Success(T value) => new(true, Error.None, value);
    public new static Result<T> Failure(Error error) => new(false, error);
    
    public static implicit operator Result<T>(Error error) => Failure(error);
}

public sealed record Error(string Key, string? Description = null)
{
    public static readonly Error None = new(string.Empty);
    public static readonly Error UserAlreadyExists = new("Error.User.AlreadyExists", "User with this email address already exists.");
    public static readonly Error NotFound = new("Errors.Common.NotFound", "The requested resource was not found.");
    public static readonly Error InvalidCredentials = new("Errors.Auth.InvalidCredentials", "Email or password incorrect.");
    public static readonly Error InvalidApplicationCredentials = new("Errors.Auth.InvalidApplicationCredentials", "Client id or secret incorrect.");
    public static readonly Error InvalidAuthToken = new("Errors.Auth.InvalidAuthToken", "Provided auth token is invalid.");
    public static readonly Error BadRequest = new("Errors.Common.BadRequest", "The requested operation was invalid.");
    public static implicit operator Result(Error error) => Result.Failure(error);
}