// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Sakura.Network;
using DragonFruit.Sakura.Network.Requests;
using Microsoft.AspNetCore.Components;

namespace DragonFruit.Sakura.OnionFruit
{
    public partial class Countries
    {
        private OnionDb _database;

        [Inject]
        private SakuraClient Client { get; set; }

        private OnionDb Database
        {
            get => _database;
            set
            {
                _database = value;
                GlobalNodeCount = _database.Countries.Sum(x => x.TotalNodeCount);
            }
        }

        private float GlobalNodeCount { get; set; }

        protected override async Task OnInitializedAsync()
        {
            if (Client.IsServerSide)
            {
                return;
            }

            Database = await Client.PerformAsync<MemoryStream>(new OnionFruitDatabaseRequest())
                                   .ContinueWith(t => OnionDb.Parser.ParseFrom(t.Result), TaskContinuationOptions.OnlyOnRanToCompletion);
        }
    }
}
