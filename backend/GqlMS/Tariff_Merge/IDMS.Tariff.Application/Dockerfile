## multi-stage Dockerfile for IDMS.Tariff.Application (.NET 8)
#
#FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
#WORKDIR /app
#EXPOSE 8080
#EXPOSE 8081
#
#FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
#ARG BUILD_CONFIGURATION=Release
#WORKDIR /src
#
## Copy only the project files needed for restore (preserve relative layout)
#COPY ["../IDMS.Tariff.Application/IDMS.Tariff.Application.csproj", "./"]
#COPY ["../IDMS.Tariff/IDMS.Tariff.GqlTypes.csproj", "../IDMS.Tariff/"]
#COPY ["../IDMS.Package/IDMS.Package.GqlTypes.csproj", "../IDMS.Package/"]
##COPY ["../../Models/IDMS.Models/IDMS.Models.csproj", "../../Models/IDMS.Models/"]
##
#RUN dotnet restore "IDMS.Tariff.Application.csproj"
#
## Copy the rest of the source and build
#COPY . .
#COPY ["../IDMS.Tariff.Application/ReleaseDll/.","."]
#WORKDIR "/src"
#RUN dotnet build "IDMS.Tariff.Application.csproj" -c $BUILD_CONFIGURATION -o /app/build
#
#FROM build AS publish
#ARG BUILD_CONFIGURATION=Release
#RUN dotnet publish "IDMS.Tariff.Application.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false
#
#FROM base AS final
#WORKDIR /app
#COPY --from=publish /app/publish .
#ENV ASPNETCORE_URLS=http://+:8080
#USER app
#ENTRYPOINT ["dotnet", "IDMS.Tariff.Application.dll"]



# Use ASP.NET Core runtime only (no SDK)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Copy prebuilt publish folder into container
COPY ./publish/ ./

ENV ASPNETCORE_URLS=http://+:8080

# Optional: use non-root user depending on your base image config
USER app

ENTRYPOINT ["dotnet", "IDMS.Tariff.Application.dll"]
