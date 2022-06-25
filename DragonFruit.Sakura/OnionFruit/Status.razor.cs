// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;
using DragonFruit.Sakura.Network;
using DragonFruit.Sakura.Network.Requests;
using Microsoft.AspNetCore.Components;
using MudBlazor;

namespace DragonFruit.Sakura.OnionFruit
{
    public partial class Status
    {
        [Inject]
        private ApiClient Client { get; set; }

        public ApiGeolocationInfo ConnectionInfo { get; set; }

        protected override async Task OnInitializedAsync()
        {
            ConnectionInfo = await Client.PerformAsync<ApiGeolocationInfo>(new ApiGeolocationInfoRequest()).ConfigureAwait(false);
        }

        private (string icon, string title, string colour) GetConnectionDisplay() => ConnectionInfo?.IsConnectedToTor switch
        {
            true => (Icons.Rounded.WifiLock, "Connected", "#76FF03"),
            false => (Icons.Rounded.SignalWifi4Bar, "Disconnected", "#D50000"),
            null => (Icons.Rounded.WifiFind, "Unknown", "#212121")
        };
    }
}
