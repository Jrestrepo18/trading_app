using TradingApp.Domain.Entities;

namespace TradingApp.Domain.Interfaces;

public interface ISignalRepository
{
    Task<IEnumerable<Signal>> GetAllActiveAsync();
    Task<IEnumerable<Signal>> GetAllSignalsAsync();
    Task<Signal?> GetByIdAsync(string id);
    Task CreateAsync(Signal signal);
    Task UpdateAsync(Signal signal);
    Task DeleteAsync(string id);
}
