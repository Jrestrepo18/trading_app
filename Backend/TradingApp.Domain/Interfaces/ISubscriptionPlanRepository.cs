using TradingApp.Domain.Entities;

namespace TradingApp.Domain.Interfaces;

public interface ISubscriptionPlanRepository
{
    Task<IEnumerable<SubscriptionPlan>> GetAllAsync();
    Task<SubscriptionPlan?> GetByIdAsync(Guid id);
    Task CreateAsync(SubscriptionPlan plan);
    Task UpdateAsync(SubscriptionPlan plan);
    Task DeleteAsync(Guid id);
}
