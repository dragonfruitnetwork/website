// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public class AdminApiAppsListingRequest : YunaApiRequest
    {
        protected override string Stub => "/apps";
        protected override bool RequireAuth => true;
    }
}
