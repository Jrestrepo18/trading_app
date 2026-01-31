namespace TradingApp.Domain.Validators;

/// <summary>
/// Age validation to ensure users are 18+
/// </summary>
public static class AgeValidator
{
    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public int Age { get; set; }
    }

    /// <summary>
    /// Validates that the user is at least 18 years old
    /// </summary>
    public static ValidationResult Validate(DateTime birthDate)
    {
        var today = DateTime.UtcNow;
        var age = today.Year - birthDate.Year;

        // Adjust if birthday hasn't occurred this year
        if (birthDate.Date > today.AddYears(-age))
        {
            age--;
        }

        return new ValidationResult
        {
            IsValid = age >= 18,
            Age = age
        };
    }
}
