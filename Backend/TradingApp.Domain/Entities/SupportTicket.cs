using System.ComponentModel.DataAnnotations;

namespace TradingApp.Domain.Entities;

public class SupportTicket
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public string UserId { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;

    public string Subject { get; set; } = string.Empty;

    public string Status { get; set; } = "OPEN"; // OPEN, PENDING, RESOLVED, CLOSED

    public string Priority { get; set; } = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT

    public string Region { get; set; } = "GLOBAL";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime LastActivity { get; set; } = DateTime.UtcNow;

    public int? Rating { get; set; } // 1-5 scale for user satisfaction
}
