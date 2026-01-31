using Google.Cloud.Firestore;
using TradingApp.Domain.Entities;
using TradingApp.Domain.Interfaces;

namespace TradingApp.Infrastructure.Repositories;

public class SignalRepository : ISignalRepository
{
    private readonly FirestoreDb _db;
    private const string CollectionName = "signals";

    public SignalRepository(FirestoreDb db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Signal>> GetAllActiveAsync()
    {
        // Fetch all and filter in memory to ensure reliability
        var query = _db.Collection(CollectionName);
        var snapshot = await query.GetSnapshotAsync();
        
        var allowedStatuses = new HashSet<string> { "Active", "BE", "TP1", "TP2", "TP3" };

        return snapshot.Documents.Select(MapToSignal)
            .Where(s => allowedStatuses.Contains(s.Status))
            .OrderByDescending(s => s.CreatedAt)
            .ToList();
    }

    public async Task<IEnumerable<Signal>> GetAllSignalsAsync()
    {
        var query = _db.Collection(CollectionName);
        var snapshot = await query.GetSnapshotAsync();
        
        return snapshot.Documents.Select(MapToSignal)
            .OrderByDescending(s => s.CreatedAt)
            .ToList();
    }

    public async Task<Signal?> GetByIdAsync(string id)
    {
        var docRef = _db.Collection(CollectionName).Document(id);
        var snapshot = await docRef.GetSnapshotAsync();

        if (!snapshot.Exists)
            return null;

        return MapToSignal(snapshot);
    }

    public async Task CreateAsync(Signal signal)
    {
        var docRef = string.IsNullOrEmpty(signal.Id) 
            ? _db.Collection(CollectionName).Document() 
            : _db.Collection(CollectionName).Document(signal.Id);
        
        signal.Id = docRef.Id;
        signal.CreatedAt = signal.CreatedAt == default ? DateTime.UtcNow : signal.CreatedAt;

        await docRef.SetAsync(new Dictionary<string, object>
        {
            { "id", signal.Id },
            { "pair", signal.Pair },
            { "type", signal.Type },
            { "orderType", signal.OrderType },
            { "entry", (double)signal.Entry },
            { "sl", (double)signal.SL },
            { "tp1", (double)signal.TP1 },
            { "tp2", signal.TP2.HasValue ? (double)signal.TP2.Value : null! },
            { "tp3", signal.TP3.HasValue ? (double)signal.TP3.Value : null! },
            { "analysis", signal.Analysis ?? "" },
            { "imageUrl", signal.ImageUrl ?? "" },
            { "createdAt", Timestamp.FromDateTime(signal.CreatedAt.ToUniversalTime()) },
            { "status", signal.Status },
            { "followersCount", signal.FollowersCount }
        });
    }

    public async Task UpdateAsync(Signal signal)
    {
        var docRef = _db.Collection(CollectionName).Document(signal.Id);
        await docRef.UpdateAsync(new Dictionary<string, object>
        {
            { "status", signal.Status },
            { "followersCount", signal.FollowersCount }
        });
    }

    public async Task DeleteAsync(string id)
    {
        var docRef = _db.Collection(CollectionName).Document(id);
        await docRef.DeleteAsync();
    }

    private static Signal MapToSignal(DocumentSnapshot snapshot)
    {
        var data = snapshot.ToDictionary();
        return new Signal
        {
            Id = snapshot.Id,
            Pair = data.GetValueOrDefault("pair")?.ToString() ?? "",
            Type = data.GetValueOrDefault("type")?.ToString() ?? "",
            OrderType = data.GetValueOrDefault("orderType")?.ToString() ?? "MARKET",
            Entry = Convert.ToDecimal(data.GetValueOrDefault("entry")),
            SL = Convert.ToDecimal(data.GetValueOrDefault("sl")),
            TP1 = Convert.ToDecimal(data.GetValueOrDefault("tp1")),
            TP2 = data.GetValueOrDefault("tp2") != null ? Convert.ToDecimal(data.GetValueOrDefault("tp2")) : null,
            TP3 = data.GetValueOrDefault("tp3") != null ? Convert.ToDecimal(data.GetValueOrDefault("tp3")) : null,
            Analysis = data.GetValueOrDefault("analysis")?.ToString(),
            ImageUrl = data.GetValueOrDefault("imageUrl")?.ToString(),
            CreatedAt = data.GetValueOrDefault("createdAt") is Timestamp ts ? ts.ToDateTime() : DateTime.MinValue,
            Status = data.GetValueOrDefault("status")?.ToString() ?? "Active",
            FollowersCount = Convert.ToInt32(data.GetValueOrDefault("followersCount") ?? 0)
        };
    }
}
