using TradingApp.Domain.Entities;
using TradingApp.Domain.Interfaces;
using TradingApp.Domain.Validators;

namespace TradingApp.Application.Services;

/// <summary>
/// Authentication service implementation
/// Orchestrates validation and delegates to Firebase
/// </summary>
public class AuthService : IAuthService
{
    private readonly IFirebaseAuthProvider _firebaseAuth;
    private readonly IUserRepository _userRepository;

    public AuthService(IFirebaseAuthProvider firebaseAuth, IUserRepository userRepository)
    {
        _firebaseAuth = firebaseAuth;
        _userRepository = userRepository;
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequest request)
    {
        try
        {
            // Validate password
            var passwordValidation = PasswordValidator.Validate(request.Password);
            if (!passwordValidation.IsValid)
            {
                return new AuthResult
                {
                    Success = false,
                    Error = "La contraseña no cumple con los requisitos de seguridad. " +
                           "Debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo."
                };
            }

            // Validate age (18+)
            var ageValidation = AgeValidator.Validate(request.BirthDate);
            if (!ageValidation.IsValid)
            {
                return new AuthResult
                {
                    Success = false,
                    Error = $"Debes ser mayor de 18 años para registrarte. Edad calculada: {ageValidation.Age} años."
                };
            }

            // Create user in Firebase Auth
            var authResult = await _firebaseAuth.CreateUserAsync(request.Email, request.Password, request.Name);
            if (!authResult.Success)
            {
                return authResult;
            }

            // Create user document in Firestore
            var user = new User
            {
                Id = authResult.User!.Id,
                Email = request.Email,
                Name = request.Name,
                BirthDate = request.BirthDate,
                IsEmailVerified = false,
                CreatedAt = DateTime.UtcNow,
                AuthProvider = "email",
                Role = "user"
            };

            await _userRepository.CreateAsync(user);

            // Send verification email
            await _firebaseAuth.SendEmailVerificationAsync(authResult.User.Id);

            return new AuthResult
            {
                Success = true,
                User = user,
                Token = authResult.Token,
                Message = "Registro exitoso. Por favor verifica tu correo electrónico."
            };
        }
        catch (Exception ex)
        {
            return new AuthResult
            {
                Success = false,
                Error = $"Error en el registro: {ex.Message}"
            };
        }
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request)
    {
        // Verify credentials with Firebase
        var authResult = await _firebaseAuth.SignInWithEmailAndPasswordAsync(request.Email, request.Password);
        if (!authResult.Success)
        {
            return authResult;
        }

        // Check if email is verified
        if (!authResult.User!.IsEmailVerified)
        {
            return new AuthResult
            {
                Success = false,
                Error = "Por favor verifica tu correo electrónico antes de iniciar sesión.",
                NeedsVerification = true,
                User = new User { Email = request.Email }
            };
        }

        // Get full user data from Firestore
        var user = await _userRepository.GetByIdAsync(authResult.User.Id);
        if (user != null)
        {
            authResult.User = user;
        }

        return authResult;
    }

    public async Task<AuthResult> LoginWithGoogleAsync(string idToken)
    {
        // Verify Google token and get user
        var authResult = await _firebaseAuth.VerifyGoogleTokenAsync(idToken);
        if (!authResult.Success)
        {
            return authResult;
        }

        // Check if user exists in Firestore
        var existingUser = await _userRepository.GetByIdAsync(authResult.User!.Id);
        
        if (existingUser == null)
        {
            // New user - create in Firestore
            var newUser = new User
            {
                Id = authResult.User.Id,
                Email = authResult.User.Email,
                Name = authResult.User.Name,
                IsEmailVerified = true, // Google accounts are pre-verified
                CreatedAt = DateTime.UtcNow,
                AuthProvider = "google",
                PhotoUrl = authResult.User.PhotoUrl,
                Role = "user"
            };

            await _userRepository.CreateAsync(newUser);
            authResult.User = newUser;
            authResult.IsNewUser = true;
        }
        else
        {
            authResult.User = existingUser;
        }

        return authResult;
    }

    public async Task<Result> SendPasswordResetEmailAsync(string email)
    {
        return await _firebaseAuth.SendPasswordResetEmailAsync(email);
    }

    public async Task<Result> ConfirmPasswordResetAsync(string oobCode, string newPassword)
    {
        // Validate new password
        var passwordValidation = PasswordValidator.Validate(newPassword);
        if (!passwordValidation.IsValid)
        {
            return new Result
            {
                Success = false,
                Error = "La nueva contraseña no cumple con los requisitos de seguridad."
            };
        }

        return await _firebaseAuth.ConfirmPasswordResetAsync(oobCode, newPassword);
    }

    public async Task<Result> VerifyEmailAsync(string oobCode)
    {
        var result = await _firebaseAuth.VerifyEmailAsync(oobCode);
        
        if (result.Success && result is AuthResult authResult && authResult.User != null)
        {
            // Update user in Firestore
            var user = await _userRepository.GetByIdAsync(authResult.User.Id);
            if (user != null)
            {
                user.IsEmailVerified = true;
                await _userRepository.UpdateAsync(user);
            }
        }

        return result;
    }

    public async Task<User?> GetCurrentUserAsync(string uid)
    {
        return await _userRepository.GetByIdAsync(uid);
    }
}

/// <summary>
/// Firebase authentication provider interface
/// </summary>
public interface IFirebaseAuthProvider
{
    Task<AuthResult> CreateUserAsync(string email, string password, string displayName);
    Task<AuthResult> SignInWithEmailAndPasswordAsync(string email, string password);
    Task<AuthResult> VerifyGoogleTokenAsync(string idToken);
    Task<Result> SendEmailVerificationAsync(string uid);
    Task<Result> SendPasswordResetEmailAsync(string email);
    Task<Result> ConfirmPasswordResetAsync(string oobCode, string newPassword);
    Task<Result> VerifyEmailAsync(string oobCode);
    Task<string> CreateCustomTokenAsync(string uid);
}
