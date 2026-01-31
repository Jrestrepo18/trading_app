using System.Text.RegularExpressions;

namespace TradingApp.Domain.Validators;

/// <summary>
/// Password validation with security requirements
/// </summary>
public static class PasswordValidator
{
    /// <summary>
    /// Password validation result
    /// </summary>
    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public PasswordRequirements Requirements { get; set; } = new();
        public int Strength { get; set; }
        public string StrengthLabel { get; set; } = string.Empty;
    }

    public class PasswordRequirements
    {
        public bool MinLength { get; set; }
        public bool HasUppercase { get; set; }
        public bool HasLowercase { get; set; }
        public bool HasNumber { get; set; }
        public bool HasSpecial { get; set; }
    }

    /// <summary>
    /// Validates password against security requirements:
    /// - Minimum 8 characters
    /// - At least 1 uppercase letter
    /// - At least 1 lowercase letter  
    /// - At least 1 number
    /// - At least 1 special character (@#$%^&*!_-)
    /// </summary>
    public static ValidationResult Validate(string password)
    {
        var requirements = new PasswordRequirements
        {
            MinLength = password.Length >= 8,
            HasUppercase = Regex.IsMatch(password, @"[A-Z]"),
            HasLowercase = Regex.IsMatch(password, @"[a-z]"),
            HasNumber = Regex.IsMatch(password, @"[0-9]"),
            HasSpecial = Regex.IsMatch(password, @"[@#$%^&*!_\-]")
        };

        var passedCount = new[]
        {
            requirements.MinLength,
            requirements.HasUppercase,
            requirements.HasLowercase,
            requirements.HasNumber,
            requirements.HasSpecial
        }.Count(r => r);

        var isValid = passedCount == 5;
        var strengthLabel = passedCount switch
        {
            <= 2 => "Débil",
            <= 4 => "Moderada",
            _ => "Fuerte"
        };

        return new ValidationResult
        {
            IsValid = isValid,
            Requirements = requirements,
            Strength = passedCount,
            StrengthLabel = strengthLabel
        };
    }
}
