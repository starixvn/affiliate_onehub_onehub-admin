# Stage 1: Build Frontend
# FROM hub.nexdev.net/base/node:22-alpine-25h2 AS node

# WORKDIR /app

# RUN npm install -g pnpm

# COPY src/ONEHub.WebApi/wwwroot/package.json src/ONEHub.WebApi/wwwroot/package-lock.json* ./
# RUN pnpm install --frozen-lockfile

# COPY src/ONEHub.WebApi/wwwroot/ ./
# RUN pnpm run build:all:pro

# Stage 2: Build .NET Backend
FROM hub.nexdev.net/base/dotnet/core/sdk:9.0-alpine AS builder

WORKDIR /src

COPY *.sln .
COPY nuget.config ./
COPY Directory.Packages.props ./
COPY Directory.Build.props ./
COPY src/ONEHub.Domain/ ./ONEHub.Domain/
COPY src/ONEHub.Application/ ./ONEHub.Application/
COPY src/ONEHub.Infrastructure/ ./ONEHub.Infrastructure/
COPY src/ONEHub.WebApi/ ./ONEHub.WebApi/

# Restore packages
WORKDIR /src/ONEHub.WebApi
RUN dotnet nuget add source https://nuget.nexdev.net/api/v2
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet restore -v n -r linux-musl-x64 "./ONEHub.WebApi.csproj"

RUN --mount=type=cache,target=/src/packages \
    dotnet publish -r linux-musl-x64 --self-contained false -o /app/publish

FROM hub.nexdev.net/base/dotnet/core/aspnet:9.0-alpine

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

# Install curl for healthcheck and create non-root user
RUN apk add --no-cache curl && \
    adduser --disabled-password \
    --home /app \
    --gecos '' dotnetuser && \
    chown -R dotnetuser /app && \
    chown -R dotnetuser /tmp

USER dotnetuser

WORKDIR "/app"

COPY --from=builder /app/publish .
# COPY --from=node /app/dist ./wwwroot/dist
ENV TZ="America/La_Paz"

# Health check using the new endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/healthz || exit 1

# Start the application
ENTRYPOINT ["dotnet", "ONEHub.WebApi.dll"]
