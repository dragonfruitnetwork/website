using System.Reflection;
using System.Threading.Tasks;
using DragonFruit.Sakura.Network;
using DragonFruit.Sakura.Wiki;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MudBlazor.Services;
using Sentry;

namespace DragonFruit.Sakura.Host
{
    public static class Program
    {
        public static Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Configuration.AddCommandLine(args);
            builder.Configuration.AddEnvironmentVariables();
            builder.Configuration.AddIniFile("config.ini", optional: true);

            // enable _content files
            builder.WebHost.UseStaticWebAssets();

            builder.Logging.ClearProviders()
                   .AddSimpleConsole(o =>
                   {
                       o.SingleLine = true;
                       o.IncludeScopes = false;
                       o.TimestampFormat = "[dd/MM/yyyy hh:mm:ss] ";
                   })
                   .AddSentry(o =>
                   {
                       o.Dsn = builder.Configuration["Sentry:Dsn"];
                       o.Release = Assembly.GetExecutingAssembly().GetName().Version!.ToString(3);

                       o.MaxBreadcrumbs = 50;
                       o.MinimumEventLevel = LogLevel.Error;
                       o.MinimumBreadcrumbLevel = LogLevel.Debug;

                       o.DisableUnobservedTaskExceptionCapture();
                   });

            builder.Services.AddApiAuthorization();
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddControllersWithViews();

            builder.Services.AddMudServices();
            builder.Services.AddScoped<WikiRenderer>();
            builder.Services.AddScoped<SakuraClient, SakuraServerClient>();

            var app = builder.Build();

            app.UseBlazorFrameworkFiles();
            app.UseStaticFiles();

            app.UseRouting();
            app.MapControllers();

            app.MapFallbackToController("Host", "Blazor");
            app.MapFallbackToController("/changelogs/{app}/{version}", "Host", "Blazor");

            return app.RunAsync();
        }
    }
}
