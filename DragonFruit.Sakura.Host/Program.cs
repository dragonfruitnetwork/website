using System.Reflection;
using System.Threading.Tasks;
using DragonFruit.Data;
using DragonFruit.Sakura.Wiki;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MudBlazor.Services;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;

namespace DragonFruit.Sakura.Host
{
    public static class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Configuration.AddCommandLine(args);
            builder.Configuration.AddEnvironmentVariables();
            builder.Configuration.AddIniFile("config.ini", optional: true);

            // enable _content files
            builder.WebHost.UseStaticWebAssets();

            builder.Logging.AddSerilog(new LoggerConfiguration()
                                       .MinimumLevel.Debug()
                                       .WriteTo.Console(theme: AnsiConsoleTheme.Literate)
                                       .WriteTo.Sentry(o =>
                                       {
                                           o.Dsn = builder.Configuration["Sentry:Dsn"];

                                           o.MaxBreadcrumbs = 50;
                                           o.MinimumEventLevel = LogEventLevel.Error;
                                           o.MinimumBreadcrumbLevel = LogEventLevel.Debug;

                                           var version = Assembly.GetExecutingAssembly().GetName().Version;
                                           o.Release = version?.ToString(version.Build > 0 ? 3 : 2);
                                       }).CreateLogger(), true);

            builder.Services.AddApiAuthorization();
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddControllersWithViews();

            builder.Services.AddMudServices();
            builder.Services.AddScoped<WikiRenderer>();
            builder.Services.AddScoped<ApiClient, SakuraServerClient>();

            var app = builder.Build();

            app.UseBlazorFrameworkFiles();
            app.UseStaticFiles();

            app.UseRouting();
            app.MapControllers();
            app.MapFallbackToController("Host", "Blazor");

            await app.RunAsync().ConfigureAwait(false);
        }
    }
}
