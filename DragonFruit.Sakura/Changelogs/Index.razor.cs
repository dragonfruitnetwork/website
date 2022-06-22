using DragonFruit.Data;
using DragonFruit.Sakura.Network;
using DragonFruit.Sakura.Network.Requests;
using Microsoft.AspNetCore.Components;

namespace DragonFruit.Sakura.Changelogs
{
    public partial class Index
    {
        private ApiChangelogRelease Release { get; set; }
        
        [Inject]
        private ApiClient Client { get; set; }
        
        [Parameter]
        public string AppName { get; set; }
        
        [Parameter]
        public string VersionName { get; set; }
        
        protected override async Task OnParametersSetAsync()
        {
            var releaseRequest = new ApiChangelogsRequest(AppName, VersionName);
            Release = await Client.PerformAsync<ApiChangelogRelease>(releaseRequest).ConfigureAwait(false);
        }
    }
}