using Microsoft.AspNetCore.Mvc;
using TradingApp.Domain.Interfaces;

namespace TradingApp.API.Controllers;

/// <summary>
/// Authentication API Controller
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Register a new user with email and password
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto request)
    {
        _logger.LogInformation("Registration attempt for email: {Email}", request.Email);

        var result = await _authService.RegisterAsync(new RegisterRequest
        {
            Name = request.Name,
            Email = request.Email,
            Password = request.Password,
            BirthDate = request.BirthDate
        });

        if (!result.Success)
        {
            return BadRequest(new { error = result.Error });
        }

        return Ok(new
        {
            success = true,
            message = result.Message,
            user = new
            {
                uid = result.User?.Id,
                email = result.User?.Email,
                name = result.User?.Name
            }
        });
    }

    /// <summary>
    /// Login with email and password
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto request)
    {
        _logger.LogInformation("Login attempt for email: {Email}", request.Email);

        var result = await _authService.LoginAsync(new LoginRequest
        {
            Email = request.Email,
            Password = request.Password
        });

        if (!result.Success)
        {
            return BadRequest(new
            {
                error = result.Error,
                needsVerification = result.NeedsVerification
            });
        }

        return Ok(new
        {
            success = true,
            token = result.Token,
            user = new
            {
                uid = result.User?.Id,
                email = result.User?.Email,
                name = result.User?.Name,
                emailVerified = result.User?.IsEmailVerified,
                photoUrl = result.User?.PhotoUrl
            }
        });
    }

    /// <summary>
    /// Login or register with Google
    /// </summary>
    [HttpPost("google")]
    public async Task<IActionResult> GoogleAuth([FromBody] GoogleAuthDto request)
    {
        _logger.LogInformation("Google auth attempt");

        var result = await _authService.LoginWithGoogleAsync(request.IdToken);

        if (!result.Success)
        {
            return BadRequest(new { error = result.Error });
        }

        return Ok(new
        {
            success = true,
            token = result.Token,
            isNewUser = result.IsNewUser,
            user = new
            {
                uid = result.User?.Id,
                email = result.User?.Email,
                name = result.User?.Name,
                photoUrl = result.User?.PhotoUrl
            }
        });
    }

    /// <summary>
    /// Send password reset email
    /// </summary>
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto request)
    {
        _logger.LogInformation("Password reset request for email: {Email}", request.Email);

        var result = await _authService.SendPasswordResetEmailAsync(request.Email);

        if (!result.Success)
        {
            return BadRequest(new { error = result.Error });
        }

        return Ok(new { success = true, message = result.Message });
    }

    /// <summary>
    /// Confirm password reset
    /// </summary>
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
    {
        _logger.LogInformation("Password reset confirmation");

        var result = await _authService.ConfirmPasswordResetAsync(request.OobCode, request.NewPassword);

        if (!result.Success)
        {
            return BadRequest(new { error = result.Error });
        }

        return Ok(new { success = true, message = result.Message });
    }

    /// <summary>
    /// Verify email address
    /// </summary>
    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto request)
    {
        _logger.LogInformation("Email verification attempt");

        var result = await _authService.VerifyEmailAsync(request.OobCode);

        if (!result.Success)
        {
            return BadRequest(new { error = result.Error });
        }

        return Ok(new { success = true, message = result.Message });
    }

    /// <summary>
    /// Get current user info
    /// </summary>
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser([FromHeader(Name = "X-User-Id")] string uid)
    {
        if (string.IsNullOrEmpty(uid))
        {
            return Unauthorized(new { error = "No autorizado" });
        }

        var user = await _authService.GetCurrentUserAsync(uid);

        if (user == null)
        {
            return NotFound(new { error = "Usuario no encontrado" });
        }

        return Ok(new
        {
            uid = user.Id,
            email = user.Email,
            name = user.Name,
            birthDate = user.BirthDate,
            emailVerified = user.IsEmailVerified,
            photoUrl = user.PhotoUrl,
            role = user.Role,
            subscription = user.Subscription
        });
    }
}

// DTOs for API requests
public record RegisterDto(string Name, string Email, string Password, DateTime BirthDate);
public record LoginDto(string Email, string Password);
public record GoogleAuthDto(string IdToken);
public record ForgotPasswordDto(string Email);
public record ResetPasswordDto(string OobCode, string NewPassword);
public record VerifyEmailDto(string OobCode);
