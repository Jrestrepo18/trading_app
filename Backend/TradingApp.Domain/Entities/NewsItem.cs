using Google.Cloud.Firestore;
using System.ComponentModel.DataAnnotations;

namespace TradingApp.Domain.Entities;

[FirestoreData]
public class NewsItem
{
    [FirestoreProperty]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [FirestoreProperty]
    public string Title { get; set; } = string.Empty;

    [FirestoreProperty]
    public string Content { get; set; } = string.Empty;

    [FirestoreProperty]
    public string Category { get; set; } = "Mercado"; // Mercado, Sistema, Señales, Promoción

    [FirestoreProperty]
    public string Type { get; set; } = "Normal"; // Normal, Alta, Urgente (Mapped to Priority in frontend)

    [FirestoreProperty]
    public string Audience { get; set; } = "Todos"; // Todos, Premium, Basic

    [FirestoreProperty]
    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    [FirestoreProperty]
    public int Views { get; set; } = 0;

    [FirestoreProperty]
    public string Status { get; set; } = "Enviado"; // Enviado, Programado, Borrador

    [FirestoreProperty]
    public DateTime? ScheduledFor { get; set; }

    [FirestoreProperty]
    public DateTime? ExpiresAt { get; set; }
}
