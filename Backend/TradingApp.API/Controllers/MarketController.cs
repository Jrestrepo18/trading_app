using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace TradingApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MarketController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<MarketController> _logger;

    public MarketController(HttpClient httpClient, ILogger<MarketController> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    [HttpGet("economic-calendar")]
    public async Task<IActionResult> GetEconomicCalendar([FromQuery] string week = "thisweek")
    {
        try
        {
            // week can be "thisweek" or "lastweek"
            string fileName = week == "lastweek" ? "ff_calendar_lastweek.json" : "ff_calendar_thisweek.json";
            
            // Fetch from Forex Factory (JSON Feed)
            var response = await _httpClient.GetAsync($"https://nfs.faireconomy.media/{fileName}");
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Error fetching external calendar data.");
            }

            var content = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<JsonElement>(content);

            return Ok(new
            {
                success = true,
                week = week,
                events = data
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetEconomicCalendar");
            return BadRequest(new { error = ex.Message });
        }
    }
}
