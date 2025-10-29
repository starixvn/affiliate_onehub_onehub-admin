# Stage 1: Build Frontend
FROM hub.nexdev.net/base/node:22-alpine-25h2 AS node

WORKDIR /app

# Enable and prepare pnpm using Corepack (built into Node 22)
RUN corepack enable && corepack prepare pnpm@9 --activate

COPY client-app/package.json client-app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY client-app/ ./
RUN pnpm run build:only

# Stage 2: Build .NET Backend
FROM hub.nexdev.net/base/dotnet/core/sdk:9.0-alpine-25h2 AS builder
ARG PROJECT=src/ONEHub.WebApi/ONEHub.WebApi.csproj

WORKDIR /app

RUN dotnet nuget add source https://nuget.nexdev.net/api/v2

COPY Directory.Build.props ./
COPY Directory.Packages.props ./
COPY ONEHub.Admin.sln ./
COPY src/ONEHub.Domain/*.csproj ./src/ONEHub.Domain/
COPY src/ONEHub.Application/*.csproj ./src/ONEHub.Application/
COPY src/ONEHub.Infrastructure/*.csproj ./src/ONEHub.Infrastructure/
COPY src/ONEHub.WebApi/*.csproj ./src/ONEHub.WebApi/

RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet restore $PROJECT

COPY src ./src

COPY --from=node /app/dist ./src/ONEHub.WebApi/wwwroot/

RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet publish $PROJECT \
    --configuration Release \
    --no-restore \
    --output /app/publish

# Stage 3: Runtime Image
FROM hub.nexdev.net/base/dotnet/core/aspnet:9.0-alpine

# Don't run as root
RUN adduser --disabled-password \
    --home /app \
    --gecos '' dotnetuser && chown -R dotnetuser /app && chown -R dotnetuser /tmp
USER dotnetuser
#

WORKDIR "/app"

COPY --from=builder /app/publish .
ENV TZ="America/La_Paz"

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

# Start the application
ENTRYPOINT ["dotnet", "ONEHub.WebApi.dll"]
