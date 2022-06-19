using DragonFruit.Data;
using DragonFruit.Data.Serializers.SystemJson;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using MudBlazor;
using MudBlazor.Services;

namespace DragonFruit.Sakura
{
    static class Program
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
            builder.Services.AddSingleton<ApiClient>(new ApiClient<ApiSystemTextJsonSerializer>());

            await builder.Build().RunAsync();
        }
    }
}
