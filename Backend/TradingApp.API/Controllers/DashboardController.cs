using Microsoft.AspNetCore.Mvc;
using TradingApp.Domain.Interfaces;

namespace TradingApp.API.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly ISignalRepository _signalRepository;
    private readonly ISupportRepository _supportRepository;

    public DashboardController(
        IUserRepository userRepository,
        ISignalRepository signalRepository,
        ISupportRepository supportRepository)
    {
        _userRepository = userRepository;
        _signalRepository = signalRepository;
        _supportRepository = supportRepository;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        // Fetch raw data to calculate stats
        // Note: In a real production app, we should add specific Count/Stats methods to repositories 
        // to avoid fetching all records. For now, we use existing methods.
        
        var users = await _userRepository.GetAllAsync();
        var signals = await _signalRepository.GetAllSignalsAsync();
        var tickets = await _supportRepository.GetAllTicketsAsync();

        var today = DateTime.UtcNow.Date;
        var activeTraders = users.Count(); // Simplified: All users are "active" for now
        var activeSignals = signals.Count(s => s.Status != "CLOSED" && s.Status != "STOPPED");
        var signalsProfit = signals.Count(s => s.Status.StartsWith("TP")); 
        var urgentTickets = tickets.Count(t => t.Priority == "URGENT" && t.Status != "RESOLVED");

        // Mock Volume Data (To be replaced with real trading data integration)
        var volume = "$84.2M"; 
        var volumeTrend = "+12.5%";

        return Ok(new
        {
            Volume = volume,
            VolumeTrend = volumeTrend,
            ActiveTraders = activeTraders,
            ActiveTradersTrend = "+48 hoy", // This would require historical user data
            ActiveSignals = activeSignals,
            ActiveSignalsSub = $"{signalsProfit} en profit",
            SupportTickets = tickets.Count(t => t.Status != "RESOLVED"),
            SupportTicketsSub = $"{urgentTickets} urgentes"
        });
    }
}
