using TradingApp.Domain.Entities;

namespace TradingApp.Domain.Interfaces;

/// <summary>
/// User repository interface for Firestore operations
/// </summary>
public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User?> GetByIdAsync(string uid);
    Task<User?> GetByEmailAsync(string email);
    Task CreateAsync(User user);
    Task UpdateAsync(User user);
    Task<bool> ExistsAsync(string uid);
}
