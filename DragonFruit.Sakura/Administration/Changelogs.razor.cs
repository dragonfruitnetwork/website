// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Net;
using DragonFruit.Data;
using DragonFruit.Sakura.Network;
using DragonFruit.Sakura.Network.Requests;
using Microsoft.AspNetCore.Components;

namespace DragonFruit.Sakura.Administration
{
    public partial class Changelogs
    {
        [Parameter]
        public ApiAppInfo TargetApp { get; set; }

        [Inject]
        private ApiClient Client { get; set; }

        private bool IsTargetNew { get; set; }
        private bool VersionConflictError { get; set; }
        private ApiChangelogRelease Target { get; set; }

        private string RequestVersion { get; set; } = DateTime.UtcNow.ToString("yyyy.Mdd");
        private IReadOnlyCollection<string> VersionHints { get; set; }

        protected override async Task OnParametersSetAsync()
        {
            var versionsRequest = new AdminApiChangelogVersionListingRequest(TargetApp.Id);
            var releases = await Client.PerformAsync<IReadOnlyCollection<ApiChangelogRelease>>(versionsRequest).ConfigureAwait(false);

            VersionHints = releases.Select(x => x.VersionName).ToList();
        }

        private Task<IEnumerable<string>> SearchReleases(string searchText)
        {
            if (VersionHints?.Any() != true)
                return Task.FromResult(Enumerable.Empty<string>());

            if (string.IsNullOrWhiteSpace(searchText))
                return Task.FromResult((IEnumerable<string>)VersionHints);

            return Task.FromResult(VersionHints.Where(x => x.Contains(searchText)));
        }

        private async Task LoadTarget()
        {
            throw new NotImplementedException();
        }

        private async Task SaveChanges()
        {
            if (!IsTargetNew)
            {
                throw new InvalidOperationException($"{nameof(SaveChanges)} can only be called on a new changelog release");
            }

            try
            {
                var request = new AdminApiChangelogsCreationRequest(TargetApp.Id, Target);
                Target = await Client.PerformAsync<ApiChangelogRelease>(request).ConfigureAwait(false);

                IsTargetNew = false;
            }
            catch (HttpRequestException httpEx) when (httpEx.StatusCode == HttpStatusCode.Conflict)
            {
                VersionConflictError = true;
            }
        }

        private async Task DeleteRelease()
        {
            // todo add confirmation
            if (!IsTargetNew)
            {
                var deletionRequest = new AdminApiChangelogsDeletionRequest(TargetApp.Id, Target.VersionName);
                using var deletionResponse = await Client.PerformAsync(deletionRequest);
                deletionResponse.EnsureSuccessStatusCode();
            }

            Target = null;
        }
    }
}
