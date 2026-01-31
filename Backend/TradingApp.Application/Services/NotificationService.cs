using System.Net.Http.Json;
using System.Text.Json;
using TradingApp.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace TradingApp.Application.Services;

public class NotificationService : INotificationService
{
    private readonly HttpClient _httpClient;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<NotificationService> _logger;
    private const string ExpoPushUrl = "https://exp.host/--/api/v2/push/send";

    public NotificationService(
        HttpClient httpClient, 
        IUserRepository userRepository,
        ILogger<NotificationService> logger)
    {
        _httpClient = httpClient;
        _userRepository = userRepository;
        _logger = logger;
    }

    public async Task<bool> SendPushNotificationAsync(string pushToken, string title, string body, object? data = null)
    {
        if (string.IsNullOrEmpty(pushToken) || !pushToken.StartsWith("ExponentPushToken"))
        {
            return false;
        }

        try
        {
            var payload = new
            {
                to = pushToken,
                title = title,
                body = body,
                data = data,
                sound = "default"
            };

            var response = await _httpClient.PostAsJsonAsync(ExpoPushUrl, payload);
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending push notification to {Token}", pushToken);
            return false;
        }
    }

    public async Task<int> SendBroadcastNotificationAsync(string title, string body, object? data = null)
    {
        var users = await _userRepository.GetAllAsync();
        var tokens = users.Where(u => !string.IsNullOrEmpty(u.PushToken)).Select(u => u.PushToken).ToList();
        
        if (!tokens.Any()) return 0;

        int successCount = 0;
        foreach (var token in tokens)
        {
            if (await SendPushNotificationAsync(token!, title, body, data))
            {
                successCount++;
            }
        }

        return successCount;
    }
}
