using Microsoft.AspNetCore.Mvc;
using TradingApp.Domain.Interfaces;

namespace TradingApp.API.Controllers;

/// <summary>
/// Users API Controller for admin management
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserRepository userRepository, ILogger<UsersController> logger)
    {
        _userRepository = userRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all users
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        _logger.LogInformation("Getting all users");

        var users = await _userRepository.GetAllAsync();

        return Ok(new
        {
            success = true,
            users = users.Select(u => new
            {
                id = u.Id,
                email = u.Email,
                name = u.Name,
                birthDate = u.BirthDate,
                isEmailVerified = u.IsEmailVerified,
                createdAt = u.CreatedAt,
                role = u.Role,
                plan = u.Subscription.Plan,
                expiresAt = u.Subscription.ExpiresAt
            })
        });
    }

    /// <summary>
    /// Get user statistics for admin dashboard
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        _logger.LogInformation("Getting user statistics");

        var users = await _userRepository.GetAllAsync();
        var usersList = users.ToList();

        var totalUsers = usersList.Count;
        var today = DateTime.UtcNow.Date;
        var sevenDaysAgo = today.AddDays(-7);

        // Note: For "active today" we would need login tracking
        // For now, we'll use email verified users as a proxy
        var verifiedUsers = usersList.Count(u => u.IsEmailVerified);
        var newUsersLast7Days = usersList.Count(u => u.CreatedAt >= sevenDaysAgo);

        // Retention rate would require more data, using a placeholder formula
        var retentionRate = totalUsers > 0 
            ? Math.Round((double)verifiedUsers / totalUsers * 100, 1) 
            : 0;

        return Ok(new
        {
            success = true,
            stats = new
            {
                totalUsers,
                activeToday = verifiedUsers, // Proxy for now
                newLast7Days = newUsersLast7Days,
                retentionRate = $"{retentionRate}%"
            }
        });
    }

    /// <summary>
    /// Get single user by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user == null)
        {
            return NotFound(new { error = "Usuario no encontrado" });
        }

        return Ok(new
        {
            success = true,
            user = new
            {
                id = user.Id,
                email = user.Email,
                name = user.Name,
                birthDate = user.BirthDate,
                isEmailVerified = user.IsEmailVerified,
                createdAt = user.CreatedAt,
                role = user.Role,
                plan = user.Subscription.Plan,
                expiresAt = user.Subscription.ExpiresAt
            }
        });
    }

    /// <summary>
    /// Register push notification token for a user
    /// </summary>
    [HttpPost("{id}/push-token")]
    public async Task<IActionResult> UpdatePushToken(string id, [FromBody] PushTokenDto request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest(new { error = "El token es requerido." });
            }

            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { error = "Usuario no encontrado." });
            }

            user.PushToken = request.Token;
            await _userRepository.UpdateAsync(user);

            _logger.LogInformation("Push token updated for user {UserId}", id);

            return Ok(new { success = true, message = "Token de notificación registrado correctamente." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating push token");
            return BadRequest(new { error = ex.Message });
        }
    }
}

public record PushTokenDto(string Token);
