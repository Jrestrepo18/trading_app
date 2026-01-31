using Microsoft.AspNetCore.Mvc;
using TradingApp.Domain.Entities;
using TradingApp.Domain.Interfaces;
using TradingApp.Application.Services;

namespace TradingApp.API.Controllers;

/// <summary>
/// Admin API Controller - Protected endpoints for administrators
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IFirebaseAuthProvider _firebaseAuth;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<AdminController> _logger;

    public AdminController(
        IFirebaseAuthProvider firebaseAuth,
        IUserRepository userRepository,
        ILogger<AdminController> logger)
    {
        _firebaseAuth = firebaseAuth;
        _userRepository = userRepository;
        _logger = logger;
    }

    /// <summary>
    /// Seed the first admin user (ONE TIME SETUP - Remove after first use!)
    /// </summary>
    [HttpPost("seed-admin")]
    public async Task<IActionResult> SeedAdmin([FromBody] SeedAdminDto request)
    {
        try
        {
            // Security: Only allow specific email
            if (request.Email != "jerorrpo@gmail.com")
            {
                return BadRequest(new { error = "Email no autorizado para seed de admin." });
            }

            // Secret key for extra security
            if (request.SecretKey != "TRADING_APP_ADMIN_2024")
            {
                return Unauthorized(new { error = "Clave secreta incorrecta." });
            }

            _logger.LogWarning("⚠️ SEED ADMIN: Attempting to set admin role for {Email}", request.Email);

            // Find user by email in Firestore
            var users = await _userRepository.GetByEmailAsync(request.Email);
            
            if (users == null)
            {
                return NotFound(new { error = "Usuario no encontrado. Regístrate primero." });
            }

            // Update role to admin
            users.Role = "admin";
            users.IsEmailVerified = true; // Also verify email for admin
            await _userRepository.UpdateAsync(users);

            _logger.LogWarning("✅ SEED ADMIN: Successfully set admin role for {Email} (UID: {Uid})", request.Email, users.Id);

            return Ok(new
            {
                success = true,
                message = "¡Admin configurado exitosamente! ELIMINA ESTE ENDPOINT EN PRODUCCIÓN.",
                user = new
                {
                    uid = users.Id,
                    email = users.Email,
                    name = users.Name,
                    role = users.Role
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in seed admin");
            return BadRequest(new { error = $"Error: {ex.Message}" });
        }
    }

    /// <summary>
    /// Reset and Create Admin (Hard Reset - deletes and recreates)
    /// </summary>
    [HttpPost("reset-admin")]
    public async Task<IActionResult> ResetAdmin([FromBody] SeedAdminDto request)
    {
        try
        {
            if (request.Email != "jerorrpo@gmail.com")
            {
                return BadRequest(new { error = "Email no autorizado." });
            }

            if (request.SecretKey != "TRADING_APP_ADMIN_2024")
            {
                return Unauthorized(new { error = "Clave secreta incorrecta." });
            }

            _logger.LogCritical("🔥 HARD RESET ADMIN: {Email}", request.Email);

            // 1. Try to delete from Firebase Auth if exists
            try {
                var authUser = await FirebaseAdmin.Auth.FirebaseAuth.DefaultInstance.GetUserByEmailAsync(request.Email);
                if (authUser != null) {
                    await FirebaseAdmin.Auth.FirebaseAuth.DefaultInstance.DeleteUserAsync(authUser.Uid);
                    _logger.LogWarning("Deleted existing Auth user: {Uid}", authUser.Uid);
                }
            } catch { /* Ignore if it doesn't exist */ }

            // 2. Map existing Firestore user to get Name/BirthDate or use defaults
            var existingUser = await _userRepository.GetByEmailAsync(request.Email);
            string name = existingUser?.Name ?? "Admin Jeronimo";
            DateTime birthDate = existingUser?.BirthDate ?? new DateTime(2000, 1, 1);

            // 3. Create fresh in Firebase Auth with the requested password
            var authResult = await _firebaseAuth.CreateUserAsync(request.Email, "Jero0312*", name);
            if (!authResult.Success) {
                return BadRequest(new { error = $"Error creating auth: {authResult.Error}" });
            }

            // 4. Update/Create in Firestore
            var user = new User
            {
                Id = authResult.User!.Id,
                Email = request.Email,
                Name = name,
                BirthDate = birthDate,
                IsEmailVerified = true,
                CreatedAt = DateTime.UtcNow,
                AuthProvider = "email",
                Role = "admin"
            };

            await _userRepository.CreateAsync(user);
            
            _logger.LogCritical("✅ ADMIN RECREATED SUCCESSFULLY: {Email}", request.Email);

            return Ok(new { 
                success = true, 
                message = "El admin ha sido RECONSTRUIDO. Ahora puedes loguearte con Jero0312*",
                uid = user.Id
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in hard reset admin");
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Create a new user (Admin only)
    /// </summary>
    [HttpPost("users")]
    public async Task<IActionResult> CreateUser(
        [FromHeader(Name = "X-Admin-Id")] string adminId,
        [FromBody] CreateUserDto request)
    {
        try
        {
            // Verify admin is authenticated and has admin role
            if (string.IsNullOrEmpty(adminId))
            {
                return Unauthorized(new { error = "Se requiere autenticación de administrador." });
            }

            var admin = await _userRepository.GetByIdAsync(adminId);
            if (admin == null || admin.Role != "admin")
            {
                return Forbid();
            }

            _logger.LogInformation("Admin {AdminId} creating user with email: {Email}", adminId, request.Email);

            // Create user in Firebase Auth
            var authResult = await _firebaseAuth.CreateUserAsync(request.Email, request.Password, request.Name);
            if (!authResult.Success)
            {
                return BadRequest(new { error = authResult.Error });
            }

            // Create user in Firestore with specified role
            var user = new User
            {
                Id = authResult.User!.Id,
                Email = request.Email,
                Name = request.Name,
                BirthDate = request.BirthDate,
                IsEmailVerified = request.SkipEmailVerification, // Admin can skip verification
                CreatedAt = DateTime.UtcNow,
                AuthProvider = "admin-created",
                Role = request.Role, // admin or user
            };

            await _userRepository.CreateAsync(user);

            _logger.LogInformation("User created successfully: {UserId} with role: {Role}", user.Id, user.Role);

            return Ok(new
            {
                success = true,
                message = $"Usuario creado exitosamente con rol: {request.Role}",
                user = new
                {
                    uid = user.Id,
                    email = user.Email,
                    name = user.Name,
                    role = user.Role,
                    emailVerified = user.IsEmailVerified
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            return BadRequest(new { error = $"Error al crear usuario: {ex.Message}" });
        }
    }

    /// <summary>
    /// Get all users (Admin only)
    /// </summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers([FromHeader(Name = "X-Admin-Id")] string adminId)
    {
        try
        {
            if (string.IsNullOrEmpty(adminId))
            {
                return Unauthorized(new { error = "Se requiere autenticación de administrador." });
            }

            var admin = await _userRepository.GetByIdAsync(adminId);
            if (admin == null || admin.Role != "admin")
            {
                return Forbid();
            }

            // Note: This would need a GetAllAsync method in the repository
            // For now, return a placeholder
            return Ok(new { message = "Endpoint para listar usuarios - implementar GetAllAsync en repository" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting users");
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Update user role (Admin only)
    /// </summary>
    [HttpPatch("users/{userId}/role")]
    public async Task<IActionResult> UpdateUserRole(
        [FromHeader(Name = "X-Admin-Id")] string adminId,
        string userId,
        [FromBody] UpdateRoleDto request)
    {
        try
        {
            if (string.IsNullOrEmpty(adminId))
            {
                return Unauthorized(new { error = "Se requiere autenticación de administrador." });
            }

            var admin = await _userRepository.GetByIdAsync(adminId);
            if (admin == null || admin.Role != "admin")
            {
                return Forbid();
            }

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { error = "Usuario no encontrado." });
            }

            user.Role = request.NewRole;
            await _userRepository.UpdateAsync(user);

            _logger.LogInformation("Admin {AdminId} updated user {UserId} role to: {Role}", adminId, userId, request.NewRole);

            return Ok(new
            {
                success = true,
                message = $"Rol actualizado a: {request.NewRole}",
                user = new
                {
                    uid = user.Id,
                    email = user.Email,
                    name = user.Name,
                    role = user.Role
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user role");
            return BadRequest(new { error = ex.Message });
        }
    }
}

// DTOs for Admin API
public record CreateUserDto(
    string Name,
    string Email,
    string Password,
    DateTime BirthDate,
    string Role = "user", // "user" or "admin"
    bool SkipEmailVerification = false
);

public record UpdateRoleDto(string NewRole);

public record SeedAdminDto(string Email, string SecretKey);
