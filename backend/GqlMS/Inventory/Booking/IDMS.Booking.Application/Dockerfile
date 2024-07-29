
#FROM mcr.microsoft.com/dotnet/runtime:8.0 AS base
#
#WORKDIR /app
#
## Copy the build output directly
#COPY /bin/publish .
#
#ENTRYPOINT ["dotnet", "IDMS.Booking.Application.dll"]
#
#
#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.
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
#COPY ["IDMS.Booking.Application/IDMS.Booking.Application.csproj", "."]
#RUN dotnet restore "./IDMS.Booking.Application.csproj"
#COPY . .
#WORKDIR "/src/IDMS.Booking.Application"
#RUN dotnet build "./IDMS.Booking.Application.csproj" -c $BUILD_CONFIGURATION -o /app/build
#
#FROM build AS publish
#ARG BUILD_CONFIGURATION=Release
#RUN dotnet publish "./IDMS.Booking.Application.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false
#
#FROM base AS final
#WORKDIR /app
#COPY --from=publish /app/publish .
#ENTRYPOINT ["dotnet", "IDMS.Booking.Application.dll"]


# Use an official ASP.NET Core runtime as a base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# Use the SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["IDMS.Booking.Application/IDMS.Booking.Application.csproj", "IDMS.Booking.Application/"]
RUN dotnet restore "IDMS.Booking.Application/IDMS.Booking.Application.csproj"
COPY . .
WORKDIR "/src/IDMS.Booking.Application"
RUN dotnet build "IDMS.Booking.Application.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "IDMS.Booking.Application.csproj" -c Release -o /app/publish

# Create the final runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IDMS.Booking.Application.dll"]