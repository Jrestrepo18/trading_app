using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;
using Grpc.Auth;
using TradingApp.Application.Services;
using TradingApp.Application.Interfaces;
using TradingApp.Domain.Interfaces;
using TradingApp.Infrastructure.Firebase;
using TradingApp.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "TradingApp API",
        Version = "v1",
        Description = "API de autenticación para Trading App"
    });
    
    // Add JWT Bearer Authorization
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Ingresa tu token JWT. Ejemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    });
    
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin => true) // Allow any origin for Dev
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Load Firebase credentials
var firebaseCredentialPath = builder.Configuration["Firebase:CredentialPath"] ?? "firebase-credentials.json";
var projectId = builder.Configuration["Firebase:ProjectId"] ?? "trading-app-23c3f";

GoogleCredential? credential = null;

// Try to load from environment variable first (for production/Render)
var firebaseCredentialsJson = Environment.GetEnvironmentVariable("FIREBASE_CREDENTIALS_JSON");
if (!string.IsNullOrEmpty(firebaseCredentialsJson))
{
    credential = GoogleCredential.FromJson(firebaseCredentialsJson);
    Console.WriteLine("✅ Firebase credentials loaded from environment variable");
}
else if (File.Exists(firebaseCredentialPath))
{
    credential = GoogleCredential.FromFile(firebaseCredentialPath);
    Console.WriteLine($"✅ Firebase credentials loaded from: {firebaseCredentialPath}");
    
    // Initialize Firebase Admin SDK
    if (FirebaseApp.DefaultInstance == null)
    {
        FirebaseApp.Create(new AppOptions
        {
            Credential = credential,
            ProjectId = projectId
        });
        Console.WriteLine($"✅ Firebase Admin SDK initialized for project: {projectId}");
    }

    // Configure Firestore with credentials
    var firestoreBuilder = new FirestoreDbBuilder
    {
        ProjectId = projectId,
        ChannelCredentials = credential.ToChannelCredentials()
    };
    builder.Services.AddSingleton(firestoreBuilder.Build());
    Console.WriteLine("✅ Firestore initialized");
}
else
{
    Console.WriteLine($"⚠️ Firebase credentials file not found: {firebaseCredentialPath}");
    Console.WriteLine("⚠️ Firebase features will be limited");
}

// Register services (Dependency Injection)
builder.Services.AddHttpClient();
builder.Services.AddScoped<IFirebaseAuthProvider, FirebaseAuthProvider>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ISignalRepository, SignalRepository>();
builder.Services.AddScoped<ISubscriptionPlanRepository, SubscriptionPlanRepository>();
builder.Services.AddScoped<ISupportRepository, SupportRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ISignalService, SignalService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<INewsRepository, NewsRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline
// Enable Swagger in all environments (including production for Render)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TradingApp API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowFrontend");
app.UseStaticFiles();
app.UseAuthorization();
app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => new { status = "ok", timestamp = DateTime.UtcNow });

Console.WriteLine("🚀 TradingApp API running!");
Console.WriteLine("📍 Endpoints:");
Console.WriteLine("   - Swagger: http://localhost:5257/swagger");
Console.WriteLine("   - Health:  GET /health");
Console.WriteLine("   - Stats:   GET /api/users/stats");

app.Run();
