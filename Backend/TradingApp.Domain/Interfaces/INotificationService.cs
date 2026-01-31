namespace TradingApp.Domain.Interfaces;

public interface INotificationService
{
    Task<bool> SendPushNotificationAsync(string pushToken, string title, string body, object? data = null);
    Task<int> SendBroadcastNotificationAsync(string title, string body, object? data = null);
}
