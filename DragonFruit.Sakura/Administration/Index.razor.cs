// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Sakura.Network;
using DragonFruit.Sakura.Network.Requests;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Authorization;

namespace DragonFruit.Sakura.Administration
{
    public partial class Index
    {
        private AppFeatures _selectedAppFeature = AppFeatures.Changelogs;

        [Inject]
        private SakuraClient Client { get; set; }

        [Inject]
        private AuthenticationStateProvider AuthenticationStateProvider { get; set; }

        private string Name { get; set; }
        private IReadOnlyList<ApiAppInfo> Apps { get; set; }

        private AppFeatures SelectedAppFeature
        {
            get => _selectedAppFeature;
            set
            {
                _selectedAppFeature = value;

                // don't allow apps without the feature to be selected
                if (SelectedApp?.Features.HasFlag(value) == false)
                {
                    SelectedApp = null;
                }
            }
        }

        private ApiAppInfo SelectedApp { get; set; }

        protected override async Task OnInitializedAsync()
        {
            Apps = await Client.PerformAsync<IReadOnlyList<ApiAppInfo>>(new AdminApiAppsListingRequest()).ConfigureAwait(false);
            Name = await AuthenticationStateProvider.GetAuthenticationStateAsync().ContinueWith(t => t.Result.User.Identity?.Name).ConfigureAwait(false);
        }
    }
}
