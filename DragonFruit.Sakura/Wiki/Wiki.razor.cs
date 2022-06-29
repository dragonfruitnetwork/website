// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Net;
using System.Text;
using DragonFruit.Data;
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
        private ApiClient Client { get; set; }

        [Inject]
        private WikiRenderer Renderer { get; set; }

        [Inject]
        private NavigationManager Navigation { get; set; }

        [Inject]
        private IJSRuntime JavaRuntime { get; set; }

        private WikiPage Page { get; set; }

        protected override async Task OnParametersSetAsync()
        {
            Page = null;

            try
            {
                var request = new ApiWikiPageRequest(Path);
                var response = await Client.PerformAsync<ApiWikiPage>(request).ConfigureAwait(false);

                Page = Renderer.ProcessPage(response);
            }
            catch (Exception ex)
            {
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

                Page = new WikiPage
                {
                    PagePath = string.Empty,
                    Title = "DragonFruit Wiki",
                    Content = new MarkupString(errorStringBuilder.ToString())
                };
            }
        }

        protected override void OnAfterRender(bool firstRender)
        {
            // enable syntax highlighting
            JavaRuntime.InvokeVoidAsync("Prism.highlightAll");
        }

        private List<BreadcrumbItem> GenerateBreadcrumbs()
        {
            var pathSegments = Page?.PagePath?.Split('/');
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
