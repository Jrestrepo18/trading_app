using TradingApp.Domain.Entities;

namespace TradingApp.Domain.Interfaces;

public interface INewsRepository
{
    Task<IEnumerable<NewsItem>> GetAllNewsAsync();
    Task<NewsItem> CreateNewsAsync(NewsItem newsItem);
    Task UpdateNewsAsync(NewsItem newsItem);
    Task DeleteNewsAsync(string id);
}
