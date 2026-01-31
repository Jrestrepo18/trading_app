namespace TradingApp.Domain.Entities;

/// <summary>
/// User entity representing a registered user in the system
/// </summary>
public class User
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public bool IsEmailVerified { get; set; }
    public DateTime CreatedAt { get; set; }
    public string AuthProvider { get; set; } = "email"; // "email" or "google"
    public string? PhotoUrl { get; set; }
    public string Role { get; set; } = "user";
    public string? PushToken { get; set; }
    public UserSubscription Subscription { get; set; } = new();
}

/// <summary>
/// User subscription information
/// </summary>
public class UserSubscription
{
    public string Plan { get; set; } = "free";
    public DateTime? ExpiresAt { get; set; }
}
