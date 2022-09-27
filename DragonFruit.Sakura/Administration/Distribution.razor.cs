// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Net;
using DragonFruit.Data;
using DragonFruit.Sakura.Network;
using DragonFruit.Sakura.Network.Requests;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace DragonFruit.Sakura.Administration
{
    public partial class Distribution
    {
        [Parameter]
        public ApiAppInfo TargetApp { get; set; }

        [Inject]
        private ApiClient Client { get; set; }

        [Inject]
        private IJSRuntime JavaRuntime { get; set; }

        private ApiDistributionBranch SelectedBranch { get; set; }
        private IList<ApiDistributionBranch> Branches { get; set; }

        protected override async Task OnParametersSetAsync()
        {
            Branches = null;
            SelectedBranch = null;

            var request = new AdminApiDistributionBranchesRequest(TargetApp.Id);
            Branches = await Client.PerformAsync<IList<ApiDistributionBranch>>(request).ConfigureAwait(false);

            // load first branch in to fill page with data
            await SwitchToBranch(Branches.FirstOrDefault());
        }

        private async Task SwitchToBranch(ApiDistributionBranch branch)
        {
            SelectedBranch = null;

            var request = new AdminApiDistributionBranchRequest(TargetApp.Id, branch.Name);
            SelectedBranch = await Client.PerformAsync<ApiDistributionBranch>(request).ConfigureAwait(false);
        }

        private async Task CreateBranch(string name)
        {
            var request = new AdminApiDistributionBranchCreationRequest(TargetApp.Id, name);
            var branch = await Client.PerformAsync<ApiDistributionBranch>(request).ConfigureAwait(false);

            Branches.Add(branch);
        }

        private async Task DeleteBranch(ApiDistributionBranch branch)
        {
            var request = new AdminApiDistributionBranchDeletionRequest(TargetApp.Id, branch.Name);
            using var response = await Client.PerformAsync(request).ConfigureAwait(false);

            if (response.IsSuccessStatusCode)
            {
                Branches.Remove(branch);
            }
        }

        private async Task PromoteRelease(ApiDistributionRelease release)
        {
            var request = new AdminApiDistributionActiveReleaseRequest(TargetApp.Id, SelectedBranch.Name, release.Id);
            using var response = await Client.PerformAsync(request).ConfigureAwait(false);

            if (response.StatusCode == HttpStatusCode.OK)
            {
                SelectedBranch.ActiveReleaseId = release.Id;
            }
            else
            {
                // todo display error message
            }
        }

        private async Task DeleteRelease(ApiDistributionRelease release)
        {
            if (!await JavaRuntime.InvokeAsync<bool>("confirm", "This will prevent the release from being used in the future. Do you want to proceed?").ConfigureAwait(false))
            {
                return;
            }

            var request = new AdminApiDistributionReleaseDeletionRequest(TargetApp.Id, SelectedBranch.Name, release.Id);
            using var response = await Client.PerformAsync(request).ConfigureAwait(false);

            if (response.IsSuccessStatusCode)
            {
                SelectedBranch.Releases.Remove(release);
            }
            else
            {
                // todo display error message
            }
        }
    }
}
