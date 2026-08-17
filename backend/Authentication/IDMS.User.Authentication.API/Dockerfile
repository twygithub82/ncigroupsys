# Not using this dockerfile currently, dockerFile in at project solution level  

#
#FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
#USER app
#WORKDIR /app
#EXPOSE 8080
#EXPOSE 8081
#
#FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
#ARG BUILD_CONFIGURATION=Release
#
#WORKDIR /src
#COPY ./ ./
#
##COPY ["DWMS.UserAuthentication.csproj", "."]
#RUN dotnet restore "./IDMS.UserAuthentication.sln"
#
#WORKDIR "/src/."
#RUN dotnet build "./IDMS.UserAuthentication.sln" -c $BUILD_CONFIGURATION -o /app/build
#
#FROM build AS publish
#ARG BUILD_CONFIGURATION=Release
#RUN dotnet publish "./IDMS.User.Management.Service/IDMS.User.Authentication.Service.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false
#
#FROM base AS final
#WORKDIR /app
#COPY --from=publish /app/publish .
#ENTRYPOINT ["dotnet", "IDMS.User.Authentication.API.dll"]


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

ENTRYPOINT ["dotnet", "IDMS.User.Authentication.API.dll"]