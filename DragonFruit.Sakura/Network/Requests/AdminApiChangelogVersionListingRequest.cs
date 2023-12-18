// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class AdminApiChangelogVersionListingRequest : YunaApiRequest
    {
        protected override string Stub => $"/{AppId}/changelogs/list";

        public AdminApiChangelogVersionListingRequest(string appId)
        {
            AppId = appId;
        }

        public string AppId { get; }
    }
}
