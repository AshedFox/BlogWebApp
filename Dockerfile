FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["pgefexample/pgefexample.csproj", "pgefexample/"]
RUN dotnet restore "pgefexample/pgefexample.csproj"
COPY . .
WORKDIR "/src/pgefexample"
RUN dotnet build "pgefexample.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "pgefexample.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "pgefexample.dll"]
