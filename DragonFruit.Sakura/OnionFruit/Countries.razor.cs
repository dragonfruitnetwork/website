// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Sakura.Network;
using DragonFruit.Sakura.Network.Requests;
using Microsoft.AspNetCore.Components;

namespace DragonFruit.Sakura.OnionFruit
{
    public partial class Countries
    {
        [Inject]
        private SakuraClient Client { get; set; }

        private IReadOnlyCollection<OnionCountryInfo> NodeCountries { get; set; }

        protected override async Task OnInitializedAsync()
        {
            if (Client.IsServerSide)
            {
                return;
            }

            NodeCountries = await Client.PerformAsync<IReadOnlyCollection<OnionCountryInfo>>(new OnionCountryInfoRequest()).ConfigureAwait(false);
        }
    }
}
