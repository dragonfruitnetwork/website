// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Sakura.Network;
using DragonFruit.Sakura.Network.Requests;
using Microsoft.AspNetCore.Components;
using MudBlazor;

namespace DragonFruit.Sakura.OnionFruit
{
    public partial class Status
    {
        [Inject]
        private SakuraClient Client { get; set; }

        public OnionFruitGeolocationInfo ConnectionInfo { get; set; }

        protected override async Task OnInitializedAsync()
        {
            // don't send the server information as it's going to be wrong...
            if (Client.IsServerSide)
            {
                return;
            }

            ConnectionInfo = await Client.PerformAsync<OnionFruitGeolocationInfo>(new OnionFruitStatusRequest()).ConfigureAwait(false);
        }

        private (string icon, string title, string colour) GetConnectionDisplay() => ConnectionInfo?.IsConnectedToTor switch
        {
            true => (Icons.Material.Rounded.WifiLock, "Connected", "#76FF03"),
            false => (Icons.Material.Rounded.SignalWifi4Bar, "Disconnected", "#D50000"),
            null => (Icons.Material.Rounded.WifiFind, "Unknown", "#212121")
        };
    }
}
