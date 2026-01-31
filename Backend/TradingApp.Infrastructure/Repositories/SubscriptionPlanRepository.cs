using Google.Cloud.Firestore;
using TradingApp.Domain.Entities;
using TradingApp.Domain.Interfaces;

namespace TradingApp.Infrastructure.Repositories;

public class SubscriptionPlanRepository : ISubscriptionPlanRepository
{
    private readonly FirestoreDb _db;
    private const string CollectionName = "plans";

    public SubscriptionPlanRepository(FirestoreDb db)
    {
        _db = db;
    }

    public async Task<IEnumerable<SubscriptionPlan>> GetAllAsync()
    {
        var snapshot = await _db.Collection(CollectionName).GetSnapshotAsync();
        return snapshot.Documents.Select(MapToPlan).OrderBy(p => p.Price).ToList();
    }

    public async Task<SubscriptionPlan?> GetByIdAsync(Guid id)
    {
        var docRef = _db.Collection(CollectionName).Document(id.ToString());
        var snapshot = await docRef.GetSnapshotAsync();

        if (!snapshot.Exists)
            return null;

        return MapToPlan(snapshot);
    }

    public async Task CreateAsync(SubscriptionPlan plan)
    {
        var docRef = _db.Collection(CollectionName).Document(plan.Id.ToString());
        await docRef.SetAsync(new Dictionary<string, object>
        {
            { "id", plan.Id.ToString() },
            { "name", plan.Name },
            { "price", Convert.ToDouble(plan.Price) }, // Fix: Convert decimal to double
            { "features", plan.Features },
            { "catalogId", plan.CatalogId },
            { "isActive", plan.IsActive },
            { "createdAt", Timestamp.FromDateTime(plan.CreatedAt.ToUniversalTime()) }
        });
    }

    public async Task UpdateAsync(SubscriptionPlan plan)
    {
        var docRef = _db.Collection(CollectionName).Document(plan.Id.ToString());
        var updates = new Dictionary<string, object>
        {
            { "name", plan.Name },
            { "price", Convert.ToDouble(plan.Price) }, // Fix: Convert decimal to double
            { "features", plan.Features },
            { "catalogId", plan.CatalogId },
            { "isActive", plan.IsActive },
            { "updatedAt", Timestamp.FromDateTime(DateTime.UtcNow) }
        };
        await docRef.UpdateAsync(updates);
    }

    public async Task DeleteAsync(Guid id)
    {
        var docRef = _db.Collection(CollectionName).Document(id.ToString());
        await docRef.DeleteAsync();
    }

    private static SubscriptionPlan MapToPlan(DocumentSnapshot snapshot)
    {
        var data = snapshot.ToDictionary();

        return new SubscriptionPlan
        {
            Id = Guid.TryParse(snapshot.Id, out var id) ? id : Guid.Empty,
            Name = data.GetValueOrDefault("name")?.ToString() ?? "",
            Price = Convert.ToDecimal(data.GetValueOrDefault("price") ?? 0),
            Features = (data.GetValueOrDefault("features") as List<object>)?.Select(x => x.ToString()!).ToList() ?? new List<string>(),
            CatalogId = data.GetValueOrDefault("catalogId")?.ToString() ?? "",
            IsActive = data.GetValueOrDefault("isActive") is bool active && active,
            CreatedAt = data.GetValueOrDefault("createdAt") is Timestamp ts ? ts.ToDateTime() : DateTime.MinValue,
            UpdatedAt = data.GetValueOrDefault("updatedAt") is Timestamp uts ? uts.ToDateTime() : null
        };
    }
}
