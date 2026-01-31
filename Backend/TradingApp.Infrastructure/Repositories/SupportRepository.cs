using Google.Cloud.Firestore;
using TradingApp.Domain.Entities;
using TradingApp.Domain.Interfaces;

namespace TradingApp.Infrastructure.Repositories;

public class SupportRepository : ISupportRepository
{
    private readonly FirestoreDb _db;
    private const string TicketsCollection = "tickets";
    private const string MessagesCollection = "messages";

    public SupportRepository(FirestoreDb db)
    {
        _db = db;
    }

    public async Task<IEnumerable<SupportTicket>> GetAllTicketsAsync()
    {
        var snapshot = await _db.Collection(TicketsCollection).OrderByDescending("LastActivity").GetSnapshotAsync();
        return snapshot.Documents.Select(MapToTicket).ToList();
    }

    public async Task<IEnumerable<SupportTicket>> GetUserTicketsAsync(string userId)
    {
        var snapshot = await _db.Collection(TicketsCollection)
            .WhereEqualTo("UserId", userId)
            .GetSnapshotAsync();
        
        return snapshot.Documents
            .Select(MapToTicket)
            .OrderByDescending(t => t.CreatedAt)
            .ToList();
    }

    public async Task<SupportTicket?> GetTicketByIdAsync(string ticketId)
    {
        var doc = await _db.Collection(TicketsCollection).Document(ticketId).GetSnapshotAsync();
        return doc.Exists ? MapToTicket(doc) : null;
    }

    public async Task CreateTicketAsync(SupportTicket ticket)
    {
        var docRef = _db.Collection(TicketsCollection).Document(ticket.Id);
        await docRef.SetAsync(new Dictionary<string, object>
        {
            { "Id", ticket.Id },
            { "UserId", ticket.UserId },
            { "UserName", ticket.UserName },
            { "Subject", ticket.Subject },
            { "Status", ticket.Status },
            { "Priority", ticket.Priority },
            { "Region", ticket.Region },
            { "CreatedAt", Timestamp.FromDateTime(ticket.CreatedAt.ToUniversalTime()) },
            { "LastActivity", Timestamp.FromDateTime(ticket.LastActivity.ToUniversalTime()) }
        });
    }

    public async Task UpdateTicketStatusAsync(string ticketId, string status)
    {
        var docRef = _db.Collection(TicketsCollection).Document(ticketId);
        await docRef.UpdateAsync(new Dictionary<string, object>
        {
            { "Status", status },
            { "LastActivity", Timestamp.FromDateTime(DateTime.UtcNow) }
        });
    }

    public async Task<IEnumerable<TicketMessage>> GetTicketMessagesAsync(string ticketId)
    {
        var snapshot = await _db.Collection(TicketsCollection)
            .Document(ticketId)
            .Collection(MessagesCollection)
            .OrderBy("CreatedAt")
            .GetSnapshotAsync();
        
        return snapshot.Documents.Select(MapToMessage).ToList();
    }

    public async Task AddMessageAsync(TicketMessage message)
    {
        var ticketRef = _db.Collection(TicketsCollection).Document(message.TicketId);
        
        // Add message to subcollection
        await ticketRef.Collection(MessagesCollection).Document(message.Id).SetAsync(new Dictionary<string, object>
        {
            { "Id", message.Id },
            { "TicketId", message.TicketId },
            { "SenderName", message.SenderName },
            { "Message", message.Message },
            { "AttachmentUrl", message.AttachmentUrl },
            { "IsAdmin", message.IsAdmin },
            { "CreatedAt", Timestamp.FromDateTime(message.CreatedAt.ToUniversalTime()) }
        });

        // Update ticket LastActivity
        await ticketRef.UpdateAsync(new Dictionary<string, object>
        {
            { "LastActivity", Timestamp.FromDateTime(DateTime.UtcNow) }
        });
    }

    private static SupportTicket MapToTicket(DocumentSnapshot snapshot)
    {
        var data = snapshot.ToDictionary();
        return new SupportTicket
        {
            Id = snapshot.Id,
            UserId = data.GetValueOrDefault("UserId")?.ToString() ?? "",
            UserName = data.GetValueOrDefault("UserName")?.ToString() ?? "",
            Subject = data.GetValueOrDefault("Subject")?.ToString() ?? "",
            Status = data.GetValueOrDefault("Status")?.ToString() ?? "OPEN",
            Priority = data.GetValueOrDefault("Priority")?.ToString() ?? "MEDIUM",
            Region = data.GetValueOrDefault("Region")?.ToString() ?? "GLOBAL",
            CreatedAt = data.GetValueOrDefault("CreatedAt") is Timestamp ts ? ts.ToDateTime() : DateTime.MinValue,

            LastActivity = data.GetValueOrDefault("LastActivity") is Timestamp la ? la.ToDateTime() : DateTime.MinValue,
            Rating = data.ContainsKey("Rating") ? Convert.ToInt32(data["Rating"]) : null
        };
    }

    private static TicketMessage MapToMessage(DocumentSnapshot snapshot)
    {
        var data = snapshot.ToDictionary();
        return new TicketMessage
        {
            Id = snapshot.Id,
            TicketId = data.GetValueOrDefault("TicketId")?.ToString() ?? "",
            SenderName = data.GetValueOrDefault("SenderName")?.ToString() ?? "",
            Message = data.GetValueOrDefault("Message")?.ToString() ?? "",
            AttachmentUrl = data.GetValueOrDefault("AttachmentUrl")?.ToString() ?? "",
            IsAdmin = Convert.ToBoolean(data.GetValueOrDefault("IsAdmin")),
            CreatedAt = data.GetValueOrDefault("CreatedAt") is Timestamp ts ? ts.ToDateTime() : DateTime.MinValue
        };
    }
    public async Task UpdateTicketRatingAsync(string ticketId, int rating)
    {
        var docRef = _db.Collection(TicketsCollection).Document(ticketId);
        await docRef.UpdateAsync(new Dictionary<string, object>
        {
            { "Rating", rating }
        });
    }

    public async Task<TradingApp.Domain.Models.SupportStats> GetSupportStatsAsync()
    {
        // Fetch all tickets for basic counts
        var ticketsSnapshot = await _db.Collection(TicketsCollection).GetSnapshotAsync();
        var tickets = ticketsSnapshot.Documents.Select(MapToTicket).ToList();

        // 1. Open Tickets
        var openTickets = tickets.Count(t => t.Status == "OPEN");

        // 2. Resolved Today
        var today = DateTime.UtcNow.Date;
        var resolvedToday = tickets.Count(t => t.Status == "RESOLVED" && t.LastActivity.Date == today); // Approx using LastActivity

        // 3. Satisfaction Score
        var ratedTickets = tickets.Where(t => t.Rating.HasValue).ToList();
        var satisfaction = ratedTickets.Any() ? ratedTickets.Average(t => t.Rating.Value) : 0;

        // 4. Response Time (Approximate - needs real calculation from messages ideally)
        // For efficiency, we won't fetch ALL messages for ALL tickets here. 
        // We will mock this slightly or calculate based on a sample if needed.
        // But the user wants "REAL" logic.
        // Let's iterate recently resolved tickets to check message deltas.
        
        double totalResponseTime = 0;
        int responseCount = 0;

        // Take last 20 resolved tickets to calc average response time
        var recentResolved = tickets.Where(t => t.Status == "RESOLVED").OrderByDescending(t => t.LastActivity).Take(20).ToList();

        foreach (var ticket in recentResolved)
        {
            var msgs = await GetTicketMessagesAsync(ticket.Id);
            var userMsg = msgs.FirstOrDefault(m => !m.IsAdmin);
            var adminMsg = msgs.FirstOrDefault(m => m.IsAdmin && m.CreatedAt > userMsg?.CreatedAt);

            if (userMsg != null && adminMsg != null)
            {
                totalResponseTime += (adminMsg.CreatedAt - userMsg.CreatedAt).TotalSeconds;
                responseCount++;
            }
        }

        var avgResponse = responseCount > 0 ? totalResponseTime / responseCount : 0;

        return new TradingApp.Domain.Models.SupportStats
        {
            OpenTickets = openTickets,
            ResolvedToday = resolvedToday,
            SatisfactionScore = satisfaction,
            AverageResponseTimeSeconds = avgResponse
        };
    }
}
