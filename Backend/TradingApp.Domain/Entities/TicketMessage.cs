namespace TradingApp.Domain.Entities;

public class TicketMessage
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public string TicketId { get; set; } = string.Empty;

    public string SenderName { get; set; } = string.Empty; // "Support" or User Name

    public string Message { get; set; } = string.Empty;
    public string AttachmentUrl { get; set; } = string.Empty;
    public bool IsAdmin { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
