using TradingApp.Application.DTOs;
using TradingApp.Application.Interfaces;
using TradingApp.Domain.Entities;
using TradingApp.Domain.Interfaces;

namespace TradingApp.Application.Services;

public class SignalService : ISignalService
{
    private readonly ISignalRepository _signalRepository;

    public SignalService(ISignalRepository signalRepository)
    {
        _signalRepository = signalRepository;
    }

    public async Task<IEnumerable<SignalDto>> GetActiveSignalsAsync()
    {
        var signals = await _signalRepository.GetAllActiveAsync();
        return signals.Select(MapToDto);
    }

    public async Task<SignalDto?> GetSignalByIdAsync(string id)
    {
        var signal = await _signalRepository.GetByIdAsync(id);
        return signal != null ? MapToDto(signal) : null;
    }

    public async Task<SignalDto> CreateSignalAsync(CreateSignalDto createDto)
    {
        var signal = new Signal
        {
            Pair = createDto.Pair,
            Type = createDto.Type,
            OrderType = createDto.OrderType,
            Entry = createDto.Entry,
            SL = createDto.SL,
            TP1 = createDto.TP1,
            TP2 = createDto.TP2,
            TP3 = createDto.TP3,
            Analysis = createDto.Analysis,
            ImageUrl = !string.IsNullOrEmpty(createDto.ImageBase64) 
                ? createDto.ImageBase64 
                : (!string.IsNullOrEmpty(createDto.ImageBase64_Alt) ? createDto.ImageBase64_Alt : null),
            CreatedAt = DateTime.UtcNow,
            Status = "Active"
        };

        await _signalRepository.CreateAsync(signal);
        return MapToDto(signal);
    }

    public async Task UpdateSignalStatusAsync(string id, string status)
    {
        var signal = await _signalRepository.GetByIdAsync(id);
        if (signal != null)
        {
            signal.Status = status;
            await _signalRepository.UpdateAsync(signal);
        }
    }

    public async Task DeleteSignalAsync(string id)
    {
        await _signalRepository.DeleteAsync(id);
    }

    private static SignalDto MapToDto(Signal signal)
    {
        return new SignalDto
        {
            Id = signal.Id,
            Pair = signal.Pair,
            Type = signal.Type,
            OrderType = signal.OrderType,
            Entry = signal.Entry,
            SL = signal.SL,
            TP1 = signal.TP1,
            TP2 = signal.TP2,
            TP3 = signal.TP3,
            Analysis = signal.Analysis,
            ImageUrl = signal.ImageUrl,
            CreatedAt = signal.CreatedAt,
            Status = signal.Status,
            FollowersCount = signal.FollowersCount
        };
    }
}
