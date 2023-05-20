// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Reflection;
using DragonFruit.Sakura.Network;
using DragonFruit.Sakura.Wiki;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using MudBlazor;
using MudBlazor.Services;
using Serilog;
using Serilog.Events;

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
            var loggingConfig = new LoggerConfiguration()
                                .MinimumLevel.Debug()
                                .Enrich.WithProperty("InstanceId", Guid.NewGuid().ToString("D"))
                                .WriteTo.BrowserConsole(restrictedToMinimumLevel: LogEventLevel.Information)
                                .WriteTo.Sentry(o =>
                                {
                                    var version = Assembly.GetExecutingAssembly().GetName().Version;

                                    o.MaxBreadcrumbs = 50;
                                    o.MinimumEventLevel = LogEventLevel.Error;
                                    o.MinimumBreadcrumbLevel = LogEventLevel.Debug;
                                    o.Release = version?.ToString(version.Build > 0 ? 3 : 2);
                                    o.Dsn = "https://d42ddda84a6f4ffb8d9d66cb7d1a6d9b@o97031.ingest.sentry.io/6542291";
                                });

            builder.Logging.AddSerilog(loggingConfig.CreateLogger(), true);
            builder.Services.AddOidcAuthentication(o =>
            {
                o.ProviderOptions.Authority = "https://id.dragonfruit.network/connect/authorize";
                o.ProviderOptions.MetadataUrl = "https://id.dragonfruit.network/.well-known/openid-configuration";

                o.ProviderOptions.ClientId = "00000000-0000-0000-0000-000000000001.dragonfruit.sakura.admin";
                o.ProviderOptions.ResponseType = "id_token token";

#if DEBUG
                o.ProviderOptions.RedirectUri = "https://localhost:5001/auth/login-callback";
#else
                o.ProviderOptions.RedirectUri = "https://dragonfruit.network/auth/login-callback";
#endif

                o.ProviderOptions.PostLogoutRedirectUri = "/";
                o.ProviderOptions.DefaultScopes.Add("delegate");

                o.AuthenticationPaths.LogInPath = "/auth/login";
                o.AuthenticationPaths.LogOutPath = "/auth/logout";
                o.AuthenticationPaths.LogInCallbackPath = "/auth/login-callback";
            });

            builder.Services.AddMudServices();
            builder.Services.AddScoped<WikiRenderer>();
            builder.Services.AddScoped<SakuraClient, SakuraWasmClient>();

            await builder.Build().RunAsync();
        }
    }
}
