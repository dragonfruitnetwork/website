// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Net;
using System.Text;
using DragonFruit.Sakura.Network;
using DragonFruit.Sakura.Network.Requests;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using MudBlazor;

namespace DragonFruit.Sakura.Wiki
{
    public partial class Wiki
    {
        [Parameter]
        public string Path { get; set; }

        [Inject]
        private SakuraClient Client { get; set; }

        [Inject]
        private WikiRenderer Renderer { get; set; }

        [Inject]
        private NavigationManager Navigation { get; set; }

        [Inject]
        private IJSRuntime JavaRuntime { get; set; }

        private ApiWikiPage PageMetadata { get; set; }
        private WikiPageContent PageContent { get; set; }

        protected override async Task OnParametersSetAsync()
        {
            PageMetadata = null;
            PageContent = null;

            if (Client.IsServerSide)
            {
                return;
            }

            try
            {
                var request = new ApiWikiPageRequest(Path);

                PageMetadata = await Client.PerformAsync<ApiWikiPage>(request).ConfigureAwait(false);
                PageContent = Renderer.ProcessPage(PageMetadata);
            }
            catch (Exception ex)
            {
                await JavaRuntime.InvokeVoidAsync("console.error", ex.ToString());

                var errorStringBuilder = new StringBuilder();
                errorStringBuilder.AppendLine("<div class=\"mt-3\"></div>");
                errorStringBuilder.AppendLine("There was an issue loading the requested page. Try refreshing and if it's still not working, try again later.");

                if (ex is HttpRequestException webException)
                {
                    // if not found, send to homepage
                    if (webException.StatusCode == HttpStatusCode.NotFound)
                    {
                        Navigation.NavigateTo("/wiki");
                    }

                    errorStringBuilder.Append($" ({webException.StatusCode})");
                }

                PageContent = new WikiPageContent
                {
                    PagePath = string.Empty,
                    Title = "DragonFruit Wiki",
                    Content = new MarkupString(errorStringBuilder.ToString())
                };
            }
        }

        protected override void OnAfterRender(bool firstRender)
        {
            if (Client.IsServerSide)
            {
                return;
            }

            // enable syntax highlighting
            JavaRuntime.InvokeVoidAsync("Prism.highlightAll");
        }

        private List<BreadcrumbItem> GenerateBreadcrumbs()
        {
            var pathSegments = PageContent?.PagePath?.Split('/');
            var homeSegment = new BreadcrumbItem("home", "/wiki");

            if (pathSegments is null || !pathSegments.Any())
            {
                return new List<BreadcrumbItem> { homeSegment };
            }

            // split the url into a set of segments representing the location of each page (i.e. the topmost page has to include all the parents)
            var segmentArrays = Enumerable.Range(1, pathSegments.Length).Select(i => new ArraySegment<string>(pathSegments, 0, i));
            return segmentArrays.Select(x => new BreadcrumbItem(x.Last(), $"/wiki/{string.Join("/", x)}")).Prepend(homeSegment).ToList();
        }
    }
}
