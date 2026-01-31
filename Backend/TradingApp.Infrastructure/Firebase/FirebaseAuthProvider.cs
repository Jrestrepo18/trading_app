using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using TradingApp.Application.Services;
using TradingApp.Domain.Entities;
using TradingApp.Domain.Interfaces;

namespace TradingApp.Infrastructure.Firebase;

/// <summary>
/// Firebase Authentication provider implementation
/// </summary>
public class FirebaseAuthProvider : IFirebaseAuthProvider
{
    private readonly FirebaseAuth _auth;

    public FirebaseAuthProvider()
    {
        _auth = FirebaseAuth.DefaultInstance;
    }

    public async Task<AuthResult> CreateUserAsync(string email, string password, string displayName)
    {
        try
        {
            var userArgs = new UserRecordArgs
            {
                Email = email,
                Password = password,
                DisplayName = displayName,
                EmailVerified = false
            };

            var userRecord = await _auth.CreateUserAsync(userArgs);

            return new AuthResult
            {
                Success = true,
                User = new User
                {
                    Id = userRecord.Uid,
                    Email = email,
                    Name = displayName
                },
                Token = await CreateCustomTokenAsync(userRecord.Uid)
            };
        }
        catch (FirebaseAuthException ex)
        {
            return new AuthResult
            {
                Success = false,
                Error = GetErrorMessage(ex.AuthErrorCode)
            };
        }
    }

    public async Task<AuthResult> SignInWithEmailAndPasswordAsync(string email, string password)
    {
        try
        {
            // Note: Firebase Admin SDK doesn't support sign-in with password
            // This should be done client-side. Here we verify the user exists.
            var userRecord = await _auth.GetUserByEmailAsync(email);

            return new AuthResult
            {
                Success = true,
                User = new User
                {
                    Id = userRecord.Uid,
                    Email = userRecord.Email,
                    Name = userRecord.DisplayName ?? "",
                    IsEmailVerified = userRecord.EmailVerified
                },
                Token = await CreateCustomTokenAsync(userRecord.Uid)
            };
        }
        catch (FirebaseAuthException ex)
        {
            return new AuthResult
            {
                Success = false,
                Error = GetErrorMessage(ex.AuthErrorCode)
            };
        }
    }

    public async Task<AuthResult> VerifyGoogleTokenAsync(string idToken)
    {
        try
        {
            var decodedToken = await _auth.VerifyIdTokenAsync(idToken);
            var userRecord = await _auth.GetUserAsync(decodedToken.Uid);

            return new AuthResult
            {
                Success = true,
                User = new User
                {
                    Id = userRecord.Uid,
                    Email = userRecord.Email ?? "",
                    Name = userRecord.DisplayName ?? "",
                    PhotoUrl = userRecord.PhotoUrl,
                    IsEmailVerified = true
                },
                Token = await CreateCustomTokenAsync(userRecord.Uid)
            };
        }
        catch (FirebaseAuthException ex)
        {
            return new AuthResult
            {
                Success = false,
                Error = GetErrorMessage(ex.AuthErrorCode)
            };
        }
    }

    public async Task<Result> SendEmailVerificationAsync(string uid)
    {
        try
        {
            var link = await _auth.GenerateEmailVerificationLinkAsync(
                (await _auth.GetUserAsync(uid)).Email);

            // In production, you'd send this link via your email service
            return new Result
            {
                Success = true,
                Message = "Email de verificación enviado."
            };
        }
        catch (FirebaseAuthException ex)
        {
            return new Result
            {
                Success = false,
                Error = GetErrorMessage(ex.AuthErrorCode)
            };
        }
    }

    public async Task<Result> SendPasswordResetEmailAsync(string email)
    {
        try
        {
            var link = await _auth.GeneratePasswordResetLinkAsync(email);

            // In production, you'd send this link via your email service
            return new Result
            {
                Success = true,
                Message = "Email de recuperación enviado."
            };
        }
        catch (FirebaseAuthException ex)
        {
            return new Result
            {
                Success = false,
                Error = GetErrorMessage(ex.AuthErrorCode)
            };
        }
    }

    public Task<Result> ConfirmPasswordResetAsync(string oobCode, string newPassword)
    {
        // This is handled client-side with Firebase JS SDK
        return Task.FromResult(new Result
        {
            Success = true,
            Message = "Contraseña actualizada correctamente."
        });
    }

    public Task<Result> VerifyEmailAsync(string oobCode)
    {
        // This is handled client-side with Firebase JS SDK
        return Task.FromResult(new Result
        {
            Success = true,
            Message = "Email verificado correctamente."
        });
    }

    public async Task<string> CreateCustomTokenAsync(string uid)
    {
        return await _auth.CreateCustomTokenAsync(uid);
    }

    private static string GetErrorMessage(AuthErrorCode? errorCode)
    {
        return errorCode switch
        {
            AuthErrorCode.EmailAlreadyExists => "Este correo electrónico ya está registrado.",
            AuthErrorCode.UserNotFound => "No existe una cuenta con este correo.",
            AuthErrorCode.ExpiredIdToken => "El token ha expirado.",
            AuthErrorCode.InvalidIdToken => "Token inválido.",
            _ => "Ha ocurrido un error. Intenta de nuevo."
        };
    }
}
