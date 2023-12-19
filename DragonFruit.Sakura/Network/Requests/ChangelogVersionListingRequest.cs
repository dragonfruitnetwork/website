// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class ChangelogVersionListingRequest(string appId) : YunaApiRequest
    {
        protected override string Stub => $"/{AppId}/changelogs/list";

        public string AppId { get; } = appId;
    }
}
