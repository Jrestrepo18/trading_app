using System;
using System.Text.Json.Serialization;

namespace TradingApp.Application.DTOs;

public class SignalDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;
    [JsonPropertyName("pair")]
    public string Pair { get; set; } = string.Empty;
    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;
    [JsonPropertyName("orderType")]
    public string OrderType { get; set; } = "MARKET";
    [JsonPropertyName("entry")]
    public decimal Entry { get; set; }
    [JsonPropertyName("sl")]
    public decimal SL { get; set; }
    [JsonPropertyName("tp1")]
    public decimal TP1 { get; set; }
    [JsonPropertyName("tp2")]
    public decimal? TP2 { get; set; }
    [JsonPropertyName("tp3")]
    public decimal? TP3 { get; set; }
    [JsonPropertyName("analysis")]
    public string? Analysis { get; set; }
    [JsonPropertyName("imageUrl")]
    public string? ImageUrl { get; set; }
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
    [JsonPropertyName("status")]
    public string Status { get; set; } = "Active";
    [JsonPropertyName("followersCount")]
    public int FollowersCount { get; set; }
}

public class CreateSignalDto
{
    [JsonPropertyName("pair")]
    public string Pair { get; set; } = string.Empty;
    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;
    [JsonPropertyName("orderType")]
    public string OrderType { get; set; } = "MARKET";
    [JsonPropertyName("entry")]
    public decimal Entry { get; set; }
    [JsonPropertyName("sl")]
    public decimal SL { get; set; }
    [JsonPropertyName("tp1")]
    public decimal TP1 { get; set; }
    [JsonPropertyName("tp2")]
    public decimal? TP2 { get; set; }
    [JsonPropertyName("tp3")]
    public decimal? TP3 { get; set; }
    [JsonPropertyName("analysis")]
    public string? Analysis { get; set; }
    
    [JsonPropertyName("imageBase64")]
    public string? ImageBase64 { get; set; }

    [JsonPropertyName("image_base64")]
    public string? ImageBase64_Alt { get; set; }
}
