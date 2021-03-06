// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Reflection;
using DragonFruit.Data;
using DragonFruit.Data.Serializers.SystemJson;
using DragonFruit.Sakura.Wiki;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using MudBlazor;
using MudBlazor.Services;
using Serilog;
using Serilog.Events;
using Serilog.Extensions.Logging;

namespace DragonFruit.Sakura
{
    public static class Program
    {
        public static readonly MudTheme Theme = new()
        {
            Typography = new Typography
            {
                Default = new Default
                {
                    FontFamily = new[] { "Inter", "Segoe UI", "sans-serif" }
                }
            }
        };

        public static async Task Main(string[] args)
        {
            var builder = WebAssemblyHostBuilder.CreateDefault(args);

            builder.RootComponents.Add<App>("#app");
            builder.RootComponents.Add<HeadOutlet>("head::after");

            builder.Services.AddMudServices();
            builder.Services.AddSingleton<WikiRenderer>();
            builder.Services.AddSingleton<ApiClient, ApiClient<ApiSystemTextJsonSerializer>>();

            var loggingConfig = new LoggerConfiguration()
                                .MinimumLevel.Debug()
                                .Enrich.WithProperty("InstanceId", Guid.NewGuid().ToString("D"))
                                .WriteTo.BrowserConsole()
                                .WriteTo.Sentry(o =>
                                {
                                    var version = Assembly.GetExecutingAssembly().GetName().Version;

                                    o.MaxBreadcrumbs = 50;
                                    o.MinimumEventLevel = LogEventLevel.Error;
                                    o.MinimumBreadcrumbLevel = LogEventLevel.Debug;
                                    o.Release = version?.ToString(version.Build > 0 ? 3 : 2);
                                    o.Dsn = "https://d42ddda84a6f4ffb8d9d66cb7d1a6d9b@o97031.ingest.sentry.io/6542291";
                                });

            builder.Logging.AddProvider(new SerilogLoggerProvider(loggingConfig.CreateLogger(), true));

            await builder.Build().RunAsync();
        }
    }
}
