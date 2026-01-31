using Microsoft.AspNetCore.Mvc;
using TradingApp.Application.DTOs;
using TradingApp.Application.Interfaces;
using TradingApp.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace TradingApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SignalsController : ControllerBase
{
    private readonly ISignalService _signalService;
    private readonly INotificationService _notificationService;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<SignalsController> _logger;

    public SignalsController(
        ISignalService signalService,
        INotificationService notificationService,
        IUserRepository userRepository,
        ILogger<SignalsController> logger)
    {
        _signalService = signalService;
        _notificationService = notificationService;
        _userRepository = userRepository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetActiveSignals()
    {
        var signals = await _signalService.GetActiveSignalsAsync();
        return Ok(signals);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSignalById(string id)
    {
        var signal = await _signalService.GetSignalByIdAsync(id);
        if (signal == null)
            return NotFound();

        return Ok(signal);
    }

    [HttpPost]
    public async Task<IActionResult> CreateSignal(
        [FromHeader(Name = "X-Admin-Id")] string adminId,
        [FromBody] CreateSignalDto createDto)
    {
        try
        {
            // Security check (Admin only)
            if (string.IsNullOrEmpty(adminId)) return Unauthorized();
            
            // Allow admin_123 placeholder for testing
            if (adminId != "admin_123")
            {
                var admin = await _userRepository.GetByIdAsync(adminId);
                if (admin == null || admin.Role != "admin") return Forbid();
            }

            _logger.LogInformation("Creating signal: {Pair} {Type} by Admin {AdminId}", createDto.Pair, createDto.Type, adminId);
            
            // DIAGNOSTIC LOGS
            Console.WriteLine($"\n[🏁 SIGNAL EMISSION] Pair: {createDto.Pair}");
            Console.WriteLine($"[📸 IMAGE CHECK] ImageBase64 present: {!string.IsNullOrEmpty(createDto.ImageBase64)}");
            Console.WriteLine($"[📏 IMAGE SIZE] Length: {createDto.ImageBase64?.Length ?? 0}");

            // Persist the signal
            var signal = await _signalService.CreateSignalAsync(createDto);
            
            Console.WriteLine($"[✅ SIGNAL CREATED] ID: {signal.Id} | ImageUrl length: {signal.ImageUrl?.Length ?? 0}");

            // Send push notifications to all users
            try
            {
                var notificationTitle = $"🚀 NUEVA SEÑAL: {createDto.Pair}";
                var notificationBody = $"{createDto.Type} en {createDto.Entry} | SL: {createDto.SL} | TP1: {createDto.TP1}";
                
                await _notificationService.SendBroadcastNotificationAsync(
                    notificationTitle, 
                    notificationBody,
                    new { type = "signal", signalId = signal.Id, pair = signal.Pair, hasImage = !string.IsNullOrEmpty(signal.ImageUrl) }
                );
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Signal created but notifications failed to send");
            }

            return Ok(signal);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating signal and sending notifications");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] string status)
    {
        await _signalService.UpdateSignalStatusAsync(id, status);

        // Fetch signal details for smart notification
        var signal = await _signalService.GetSignalByIdAsync(id);
        if (signal != null)
        {
            try
            {
                string title = "🔔 ACTUALIZACIÓN DE SEÑAL";
                string body = $"{signal.Pair} ha cambiado a estado: {status}";

                if (status == "TP1" || status == "TP2" || status == "TP3")
                {
                    title = "💰 PROFIT GENERADO";
                    body = $"¡{signal.Pair} ha alcanzado {status}!";
                }
                else if (status == "BE")
                {
                    title = "🛡️ PROTECCIÓN ACTIVADA";
                    body = $"{signal.Pair} movido a Breakeven. ¡Operación sin riesgo!";
                }

                await _notificationService.SendBroadcastNotificationAsync(
                    title, 
                    body, 
                    new { type = "signal_update", signalId = id, status = status, pair = signal.Pair }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send status update notification");
            }
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSignal([FromHeader(Name = "X-Admin-Id")] string adminId, string id)
    {
        try
        {
            // Security check (Admin only)
            if (string.IsNullOrEmpty(adminId)) return Unauthorized();
            
            if (adminId != "admin_123")
            {
                var admin = await _userRepository.GetByIdAsync(adminId);
                if (admin == null || admin.Role != "admin") return Forbid();
            }

            await _signalService.DeleteSignalAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting signal {Id}", id);
            return BadRequest(new { error = ex.Message });
        }
    }
}
