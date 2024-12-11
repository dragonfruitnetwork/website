FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine

WORKDIR /app

ENV ASPNETCORE_HTTP_PORTS=8080
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true

ADD . .
EXPOSE 8080

ENTRYPOINT ["dotnet", "DragonFruit.Sakura.Host.dll"]