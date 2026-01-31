using System;

namespace TradingApp.Domain.Models;

public class SupportStats
{
    public double AverageResponseTimeSeconds { get; set; }
    public double SatisfactionScore { get; set; } // 0-5
    public int OpenTickets { get; set; }
    public int ResolvedToday { get; set; }
}
