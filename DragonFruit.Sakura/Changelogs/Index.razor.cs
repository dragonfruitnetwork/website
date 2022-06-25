using System.Net;
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
        
        [Inject]
        private NavigationManager Navigation { get; set; }

        [Parameter]
        public string AppName { get; set; }

        [Parameter]
        public string VersionName { get; set; }

        protected override async Task OnParametersSetAsync()
        {
            // set to null to get the skeleton effect
            Release = null;

            var releaseRequest = string.IsNullOrEmpty(AppName)
                ? new ApiDefaultChangelogsRequest()
                : new ApiChangelogsRequest(AppName, VersionName) as ApiRequest;

            try
            {
                Release = await Client.PerformAsync<ApiChangelogRelease>(releaseRequest).ConfigureAwait(false);
            }
            catch (HttpRequestException e) when (e.StatusCode == HttpStatusCode.NotFound)
            {
                // redirect to the generic changelogs page
                Navigation.NavigateTo("/changelogs");
            }
        }
    }
}
