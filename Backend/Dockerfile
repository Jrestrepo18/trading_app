# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files
COPY TradingApp.sln .
COPY TradingApp.API/TradingApp.API.csproj TradingApp.API/
COPY TradingApp.Application/TradingApp.Application.csproj TradingApp.Application/
COPY TradingApp.Domain/TradingApp.Domain.csproj TradingApp.Domain/
COPY TradingApp.Infrastructure/TradingApp.Infrastructure.csproj TradingApp.Infrastructure/

# Restore dependencies
RUN dotnet restore

# Copy source code
COPY . .

# Build and publish
RUN dotnet publish TradingApp.API/TradingApp.API.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy published app
COPY --from=build /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:10000
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose port (Render uses 10000 by default)
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:10000/health || exit 1

# Start the application
ENTRYPOINT ["dotnet", "TradingApp.API.dll"]
