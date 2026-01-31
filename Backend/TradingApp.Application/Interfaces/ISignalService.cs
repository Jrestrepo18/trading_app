using TradingApp.Application.DTOs;

namespace TradingApp.Application.Interfaces;

public interface ISignalService
{
    Task<IEnumerable<SignalDto>> GetActiveSignalsAsync();
    Task<SignalDto?> GetSignalByIdAsync(string id);
    Task<SignalDto> CreateSignalAsync(CreateSignalDto createDto);
    Task UpdateSignalStatusAsync(string id, string status);
    Task DeleteSignalAsync(string id);
}
