#
#FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
#USER app
#WORKDIR /app
#EXPOSE 8080
#EXPOSE 8081
#
#FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
#ARG BUILD_CONFIGURATION=Release
#WORKDIR /src
##COPY ["GlobalMQ.csproj", "."]
##RUN dotnet restore "./GlobalMQ.csproj"
#
#COPY . .
#COPY ["./ReleaseDll/.","."]
#WORKDIR "/src/."
#RUN dotnet build "./GlobalMQ.csproj" -c $BUILD_CONFIGURATION -o /app/build
#
#FROM build AS publish
#ARG BUILD_CONFIGURATION=Release
#RUN dotnet publish "./GlobalMQ.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false
#
#FROM base AS final
#WORKDIR /app
#COPY --from=publish /app/publish .
#ENTRYPOINT ["dotnet", "GlobalMQ.dll"]
#


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

ENTRYPOINT ["dotnet", "GlobalMQ.dll"]