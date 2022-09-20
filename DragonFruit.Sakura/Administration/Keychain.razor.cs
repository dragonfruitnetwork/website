// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;
using DragonFruit.Sakura.Network;
using DragonFruit.Sakura.Network.Requests;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.JSInterop;

namespace DragonFruit.Sakura.Administration
{
    public partial class Keychain
    {
        private const int PageSize = 20;

        private int _currentPage = 1;

        [Inject]
        private ApiClient Client { get; set; }

        [Inject]
        private IJSRuntime JavaRuntime { get; set; }

        private DateTime? NewKeyExpiry { get; set; } = DateTime.Now.AddYears(1);

        private bool AllowLoadingMoreKeys { get; set; } = true;
        private List<ApiUserKeychainEntry> Keys { get; set; } = new();

        protected override Task OnInitializedAsync() => LoadNextPage();

        private async Task LoadNextPage()
        {
            if (!AllowLoadingMoreKeys)
                return;

            var request = new AdminApiKeychainListingRequest { Limit = PageSize, Offset = (_currentPage++ - 1) * PageSize };
            var nextPageContents = await Client.PerformAsync<IReadOnlyCollection<ApiUserKeychainEntry>>(request).ConfigureAwait(false);

            Keys.AddRange(nextPageContents);
            AllowLoadingMoreKeys = nextPageContents.Count == PageSize;
        }

        private async Task AddKey(InputFileChangeEventArgs args)
        {
            var request = new AdminApiKeychainAdditionRequest(args.File.OpenReadStream(80000), NewKeyExpiry);
            var newKey = await Client.PerformAsync<ApiUserKeychainEntry>(request).ConfigureAwait(false);

            Keys.Add(newKey);
        }

        private async Task DeleteKey(ApiUserKeychainEntry key)
        {
            if (!await JavaRuntime.InvokeAsync<bool>("confirm", "Any JWTs signed with this key will no longer be accepted. Do you want to continue?").ConfigureAwait(false))
            {
                return;
            }

            using var response = await Client.PerformAsync(new AdminApiKeychainDeletionRequest(key.KeyId)).ConfigureAwait(false);

            if (response.IsSuccessStatusCode)
            {
                Keys.Remove(key);
            }
        }
    }
}
