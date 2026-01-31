using Google.Cloud.Firestore;
using TradingApp.Domain.Entities;
using TradingApp.Domain.Interfaces;

namespace TradingApp.Infrastructure.Repositories;

public class NewsRepository : INewsRepository
{
    private readonly FirestoreDb _firestoreDb;
    private const string CollectionName = "News";

    public NewsRepository(FirestoreDb firestoreDb)
    {
        _firestoreDb = firestoreDb;
    }

    public async Task<IEnumerable<NewsItem>> GetAllNewsAsync()
    {
        var collection = _firestoreDb.Collection(CollectionName);
        var snapshot = await collection.OrderByDescending("SentAt").GetSnapshotAsync();
        
        return snapshot.Documents.Select(doc =>
        {
            var news = doc.ConvertTo<NewsItem>();
            news.Id = doc.Id;
            return news;
        }).ToList();
    }

    public async Task<NewsItem> CreateNewsAsync(NewsItem newsItem)
    {
        var collection = _firestoreDb.Collection(CollectionName);
        var docRef = collection.Document(newsItem.Id);
        await docRef.SetAsync(newsItem);
        return newsItem;
    }

    public async Task UpdateNewsAsync(NewsItem newsItem)
    {
        var collection = _firestoreDb.Collection(CollectionName);
        var docRef = collection.Document(newsItem.Id);
        await docRef.SetAsync(newsItem);
    }

    public async Task DeleteNewsAsync(string id)
    {
        var docRef = _firestoreDb.Collection(CollectionName).Document(id);
        await docRef.DeleteAsync();
    }
}
