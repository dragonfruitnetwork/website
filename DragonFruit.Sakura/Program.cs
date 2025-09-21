// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Reflection;
using DragonFruit.Sakura.Network;
using DragonFruit.Sakura.Wiki;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using MudBlazor;
using MudBlazor.Services;

namespace DragonFruit.Sakura
{
    public static class Program
    {
        public static readonly MudTheme Theme = new()
        {
            Typography = new Typography
            {
                Default = new DefaultTypography
                {
                    FontFamily = ["Inter", "Segoe UI", "sans-serif"]
                }
            }
        };

        public static Task Main(string[] args)
        {
            var builder = WebAssemblyHostBuilder.CreateDefault(args);

            builder.Logging.AddSentry(o =>
            {
                o.MaxBreadcrumbs = 50;
                o.MinimumEventLevel = LogLevel.Error;
                o.MinimumBreadcrumbLevel = LogLevel.Debug;

                o.Dsn = "https://d42ddda84a6f4ffb8d9d66cb7d1a6d9b@o97031.ingest.sentry.io/6542291";
                o.Release = Assembly.GetExecutingAssembly().GetName().Version!.ToString(3);
            });

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

            return builder.Build().RunAsync();
        }
    }
}
