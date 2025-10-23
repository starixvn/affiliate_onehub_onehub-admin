# Stage 1: Build .NET Backend
FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build

WORKDIR /app

# Copy solution and project files
COPY ONEHub.Admin.sln ./
COPY nuget.config ./
COPY src/ONEHub.Domain/*.csproj ./src/ONEHub.Domain/
COPY src/ONEHub.Application/*.csproj ./src/ONEHub.Application/
COPY src/ONEHub.Infrastructure/*.csproj ./src/ONEHub.Infrastructure/
COPY src/ONEHub.WebApi/*.csproj ./src/ONEHub.WebApi/

# Restore dependencies
RUN dotnet restore

# Copy the rest of the server source code
COPY src ./src

# Build and publish the .NET application
RUN dotnet publish src/ONEHub.WebApi/ONEHub.WebApi.csproj \
    --configuration Release \
    --no-restore \
    --output /app/publish

# Stage 2: Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine

WORKDIR /app

# Copy published application
COPY --from=build /app/publish .

# Create a non-root user
RUN adduser -D -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

# Expose ports
EXPOSE 5000

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

# Start the application
ENTRYPOINT ["dotnet", "ONEHub.WebApi.dll"]
