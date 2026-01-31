using TradingApp.Domain.Entities;

namespace TradingApp.Domain.Interfaces;

public interface ISupportRepository
{
    // Ticket Management
    Task<IEnumerable<SupportTicket>> GetAllTicketsAsync();
    Task<IEnumerable<SupportTicket>> GetUserTicketsAsync(string userId);
    Task<SupportTicket?> GetTicketByIdAsync(string ticketId);
    Task CreateTicketAsync(SupportTicket ticket);
    Task UpdateTicketStatusAsync(string ticketId, string status);
    
    // Messaging
    Task<IEnumerable<TicketMessage>> GetTicketMessagesAsync(string ticketId);
    Task AddMessageAsync(TicketMessage message);

    // Stats & Rating
    Task UpdateTicketRatingAsync(string ticketId, int rating);
    Task<TradingApp.Domain.Models.SupportStats> GetSupportStatsAsync();
}
