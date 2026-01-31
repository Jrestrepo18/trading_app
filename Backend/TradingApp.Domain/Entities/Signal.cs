using System;
using System.Collections.Generic;

namespace TradingApp.Domain.Entities;

/// <summary>
/// Represents a trading signal emitted by an admin
/// </summary>
public class Signal
{
    public string Id { get; set; } = string.Empty;
    public string Pair { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // BUY, SELL
    public string OrderType { get; set; } = "MARKET"; // MARKET, BUY_LIMIT, SELL_LIMIT
    public decimal Entry { get; set; }
    public decimal SL { get; set; }
    public decimal TP1 { get; set; }
    public decimal? TP2 { get; set; }
    public decimal? TP3 { get; set; }
    public string? Analysis { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; } = "Active"; // Active, Closed, Cancelled
    public int FollowersCount { get; set; } = 0;
}
