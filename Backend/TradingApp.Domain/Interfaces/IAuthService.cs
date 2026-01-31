using TradingApp.Domain.Entities;

namespace TradingApp.Domain.Interfaces;

/// <summary>
/// Authentication service interface
/// </summary>
public interface IAuthService
{
    Task<AuthResult> RegisterAsync(RegisterRequest request);
    Task<AuthResult> LoginAsync(LoginRequest request);
    Task<AuthResult> LoginWithGoogleAsync(string idToken);
    Task<Result> SendPasswordResetEmailAsync(string email);
    Task<Result> ConfirmPasswordResetAsync(string oobCode, string newPassword);
    Task<Result> VerifyEmailAsync(string oobCode);
    Task<User?> GetCurrentUserAsync(string uid);
}

/// <summary>
/// Generic result for operations
/// </summary>
public class Result
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public string? Error { get; set; }
}

/// <summary>
/// Authentication result with user data and token
/// </summary>
public class AuthResult : Result
{
    public User? User { get; set; }
    public string? Token { get; set; }
    public bool NeedsVerification { get; set; }
    public bool IsNewUser { get; set; }
}

/// <summary>
/// Register request DTO
/// </summary>
public class RegisterRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
}

/// <summary>
/// Login request DTO
/// </summary>
public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
