# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Install Node.js (required for Tailwind CSS compilation)
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json and install node dependencies
COPY package*.json ./
RUN npm ci

# Copy csproj and restore dependencies
COPY ["Ent.Web.csproj", "./"]
RUN dotnet restore "./Ent.Web.csproj"

# Copy all source files and publish the release
COPY . .
RUN dotnet publish "Ent.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false



# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Cloud Run defaults to container port 8080, matching ASP.NET Core 9.0 default configuration
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["dotnet", "--list-runtimes", "||", "exit", "1"]

ENTRYPOINT ["dotnet", "Ent.Web.dll"]
