FROM mcr.microsoft.com/dotnet/aspnet:7.0-alpine
WORKDIR /app

ADD . .
EXPOSE 80
ENV ASPNETCORE_URLS http://+:80

ENTRYPOINT ["dotnet", "DragonFruit.Sakura.Host.dll"]