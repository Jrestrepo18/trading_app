using Google.Cloud.Firestore;
using TradingApp.Domain.Entities;
using TradingApp.Domain.Interfaces;

namespace TradingApp.Infrastructure.Repositories;

/// <summary>
/// User repository implementation using Firestore
/// </summary>
public class UserRepository : IUserRepository
{
    private readonly FirestoreDb _db;
    private const string CollectionName = "users";

    public UserRepository(FirestoreDb db)
    {
        _db = db;
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        var snapshot = await _db.Collection(CollectionName).GetSnapshotAsync();
        return snapshot.Documents.Select(MapToUser).ToList();
    }

    public async Task<User?> GetByIdAsync(string uid)
    {
        var docRef = _db.Collection(CollectionName).Document(uid);
        var snapshot = await docRef.GetSnapshotAsync();

        if (!snapshot.Exists)
            return null;

        return MapToUser(snapshot);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        var query = _db.Collection(CollectionName)
            .WhereEqualTo("email", email)
            .Limit(1);

        var snapshot = await query.GetSnapshotAsync();

        if (snapshot.Count == 0)
            return null;

        return MapToUser(snapshot.Documents[0]);
    }

    public async Task CreateAsync(User user)
    {
        var docRef = _db.Collection(CollectionName).Document(user.Id);
        await docRef.SetAsync(new Dictionary<string, object>
        {
            { "uid", user.Id },
            { "email", user.Email },
            { "name", user.Name },
            { "birthDate", user.BirthDate.ToString("yyyy-MM-dd") },
            { "isVerified", user.IsEmailVerified },
            { "createdAt", Timestamp.FromDateTime(user.CreatedAt.ToUniversalTime()) },
            { "authProvider", user.AuthProvider },
            { "photoUrl", user.PhotoUrl ?? "" },
            { "role", user.Role },
            { "subscription", new Dictionary<string, object>
                {
                    { "plan", user.Subscription.Plan },
                    { "expiresAt", user.Subscription.ExpiresAt?.ToString("o") ?? "" }
                }
            }
        });
    }

    public async Task UpdateAsync(User user)
    {
        var docRef = _db.Collection(CollectionName).Document(user.Id);
        await docRef.UpdateAsync(new Dictionary<string, object>
        {
            { "name", user.Name },
            { "isVerified", user.IsEmailVerified },
            { "photoUrl", user.PhotoUrl ?? "" },
            { "role", user.Role }
        });
    }

    public async Task<bool> ExistsAsync(string uid)
    {
        var docRef = _db.Collection(CollectionName).Document(uid);
        var snapshot = await docRef.GetSnapshotAsync();
        return snapshot.Exists;
    }

    private static User MapToUser(DocumentSnapshot snapshot)
    {
        var data = snapshot.ToDictionary();

        return new User
        {
            Id = snapshot.Id,
            Email = data.GetValueOrDefault("email")?.ToString() ?? "",
            Name = data.GetValueOrDefault("name")?.ToString() ?? "",
            BirthDate = DateTime.TryParse(data.GetValueOrDefault("birthDate")?.ToString(), out var bd) ? bd : DateTime.MinValue,
            IsEmailVerified = data.GetValueOrDefault("isVerified") is bool verified && verified,
            CreatedAt = data.GetValueOrDefault("createdAt") is Timestamp ts ? ts.ToDateTime() : DateTime.MinValue,
            AuthProvider = data.GetValueOrDefault("authProvider")?.ToString() ?? "email",
            PhotoUrl = data.GetValueOrDefault("photoUrl")?.ToString(),
            Role = data.GetValueOrDefault("role")?.ToString() ?? "user"
        };
    }
}
