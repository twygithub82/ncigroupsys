
# ---------------------------------------
# STAGE 1: Restore (cache-friendly)
# ---------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS restore
WORKDIR /src

# Copy solution and project files first to maximize restore caching
COPY IDMS.UserAuthentication.sln ./
# API project is under IDMS.User.Management.Service/
COPY IDMS.User.Authentication.API/IDMS.User.Authentication.API.csproj IDMS.User.Authentication.API/
# Service library project is under IDMS.UserAuthentication/
COPY IDMS.User.Authentication.Service/IDMS.User.Authentication.Service.csproj IDMS.User.Authentication.Service/

# Restore NuGet packages for the solution
RUN dotnet restore IDMS.UserAuthentication.sln

# ---------------------------------------
# STAGE 2: Build
# ---------------------------------------
FROM restore AS build
# Copy the rest of the source
COPY . .
# Build API project (Release); path must match actual folder
RUN dotnet build IDMS.User.Authentication.API/IDMS.User.Authentication.API.csproj -c Release --no-restore

# ---------------------------------------
# STAGE 3: Publish
# ---------------------------------------
FROM build AS publish
RUN dotnet publish IDMS.User.Authentication.API/IDMS.User.Authentication.API.csproj -c Release -o /app/publish --no-build

# ---------------------------------------
# STAGE 4: Runtime
# ---------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published app from previous stage
COPY --from=publish /app/publish .

# Expose ports (adjust if needed)
EXPOSE 8080
EXPOSE 8081

# Bind Kestrel to HTTP (adjust if you want HTTPS)
ENV ASPNETCORE_URLS=http://+:8080

# Entry point: assembly name produced by the API project
ENTRYPOINT ["dotnet", "IDMS.User.Authentication.API.dll"]