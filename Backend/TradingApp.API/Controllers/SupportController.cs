using Microsoft.AspNetCore.Mvc;
using TradingApp.Domain.Entities;
using TradingApp.Domain.Interfaces;

namespace TradingApp.API.Controllers;

public class UpdateStatusRequest
{
    public string Status { get; set; } = string.Empty;
}

public class RateTicketRequest
{
    public int Rating { get; set; }
}

[ApiController]
[Route("api/support")]
public class SupportController : ControllerBase
{
    private readonly ISupportRepository _repository;

    public SupportController(ISupportRepository repository)
    {
        _repository = repository;
    }

    [HttpGet("tickets")]
    public async Task<IActionResult> GetAllTickets()
    {
        var tickets = await _repository.GetAllTicketsAsync();
        return Ok(tickets);
    }

    [HttpGet("user/{userId}/tickets")]
    public async Task<IActionResult> GetUserTickets(string userId)
    {
        var tickets = await _repository.GetUserTicketsAsync(userId);
        return Ok(tickets);
    }

    [HttpPost("tickets")]
    public async Task<IActionResult> CreateTicket([FromBody] SupportTicket ticket)
    {
        if (string.IsNullOrEmpty(ticket.Id)) ticket.Id = Guid.NewGuid().ToString();
        ticket.CreatedAt = DateTime.UtcNow;
        ticket.LastActivity = DateTime.UtcNow;
        
        await _repository.CreateTicketAsync(ticket);
        return Ok(ticket);
    }

    [HttpPut("tickets/{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateStatusRequest request)
    {
        var status = request.Status;
        await _repository.UpdateTicketStatusAsync(id, status);

        if (string.Equals(status, "RESOLVED", StringComparison.OrdinalIgnoreCase))
        {
            var systemMsg = new TicketMessage
            {
                Id = Guid.NewGuid().ToString(),
                TicketId = id,
                SenderName = "Sistema",
                Message = "⚠️ EL_TICKET_HA_SIDO_RESUELTO. Esta conversación ha finalizado y el chat es ahora de solo lectura.",
                IsAdmin = true,
                CreatedAt = DateTime.UtcNow
            };
            await _repository.AddMessageAsync(systemMsg);
        }

        return NoContent();
    }

    [HttpGet("tickets/{id}/messages")]
    public async Task<IActionResult> GetMessages(string id)
    {
        var messages = await _repository.GetTicketMessagesAsync(id);
        return Ok(messages);
    }

    [HttpPost("tickets/{id}/messages")]
    public async Task<IActionResult> AddMessage(string id, [FromBody] TicketMessage message)
    {
        if (id != message.TicketId) return BadRequest("Ticket ID mismatch");
        if (string.IsNullOrEmpty(message.Id)) message.Id = Guid.NewGuid().ToString();
        message.CreatedAt = DateTime.UtcNow;

        await _repository.AddMessageAsync(message);
        return Ok(message);
    }
    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "support");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var fileUrl = $"/uploads/support/{uniqueFileName}";
        return Ok(new { url = fileUrl });
    }

    [HttpPost("tickets/{id}/rate")]
    public async Task<IActionResult> RateTicket(string id, [FromBody] RateTicketRequest request)
    {
        if (request.Rating < 1 || request.Rating > 5) return BadRequest("Rating must be between 1 and 5");
        await _repository.UpdateTicketRatingAsync(id, request.Rating);
        return Ok();
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _repository.GetSupportStatsAsync();
        return Ok(stats);
    }
}
