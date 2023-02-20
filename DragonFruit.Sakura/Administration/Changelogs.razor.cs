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
        private ApiChangelogRelease Target { get; set; }

        private string RequestVersion { get; set; } = DateTime.UtcNow.ToString("yyyy.Mdd");
        private IList<string> VersionHints { get; set; }

        private static ApiChangelogModification DefaultModification => new()
        {
            Title = "Untitled Modification",
            Type = ChangelogModificationType.Fix
        };

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

        private Task<IEnumerable<string>> SearchCategories(ApiChangelogModification current, string arg)
        {
            var categoryIterator = Target.Modifications.Except(new[] { current })
                                         .Select(x => x.Category)
                                         .Where(x => !string.IsNullOrWhiteSpace(x))
                                         .Distinct();

            if (string.IsNullOrWhiteSpace(arg))
                return Task.FromResult(categoryIterator);

            return Task.FromResult(categoryIterator.Where(x => x.Contains(arg, StringComparison.OrdinalIgnoreCase)));
        }

        private async Task LoadRelease()
        {
            try
            {
                var changelogs = new ApiChangelogsRequest(TargetApp.Id, RequestVersion);

                Target = await Client.PerformAsync<ApiChangelogRelease>(changelogs).ConfigureAwait(false);
                IsTargetNew = false;
            }
            catch (HttpRequestException e) when (e.StatusCode is HttpStatusCode.NotFound)
            {
                IsTargetNew = true;
                Target = new ApiChangelogRelease
                {
                    AppId = TargetApp.Id,
                    VersionName = RequestVersion,
                    Modifications = new List<ApiChangelogModification>()
                };
            }
        }

        private async Task SaveNewRelease()
        {
            if (!IsTargetNew)
                throw new InvalidOperationException($"{nameof(SaveNewRelease)} can only be called on a new changelog release");

            Target.Release = DateTime.UtcNow;

            var request = new AdminApiChangelogsCreationRequest(TargetApp.Id, Target);
            Target = await Client.PerformAsync<ApiChangelogRelease>(request).ConfigureAwait(false);

            IsTargetNew = false;
            VersionHints.Add(Target.VersionName);
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

        private async Task SaveModification(ApiChangelogModification modification)
        {
            if (IsTargetNew)
                throw new InvalidCastException($"{nameof(SaveModification)} can only be called on live changelog releases");

            var request = modification.Id > 0
                ? new AdminApiChangelogModificationEditRequest(Target.AppId, Target.VersionName, modification)
                : new AdminApiChangelogModificationCreationRequest(Target.AppId, Target.VersionName, modification) as YunaApiRequest;

            var newModification = await Client.PerformAsync<ApiChangelogModification>(request).ConfigureAwait(false);

            // replace the modification with the new one
            Target.Modifications[Target.Modifications.IndexOf(modification)] = newModification;
        }

        private async ValueTask DeleteModification(ApiChangelogModification modification)
        {
            if (modification.Id > 1)
            {
                // if the id is non-zero, it is on the server and needs to be deleted there first
                var request = new AdminApiChangelogModificationDeletionRequest(Target.AppId, Target.VersionName, modification.Id);
                using var response = await Client.PerformAsync(request).ConfigureAwait(false);

                response.EnsureSuccessStatusCode();
            }

            Target.Modifications.Remove(modification);
            await InvokeAsync(StateHasChanged).ConfigureAwait(false);
        }
    }
}
