// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class AdminApiDistributionBranchesRequest : YunaApiRequest
    {
        protected override string Stub => $"/{AppId}/dist/branches";

        protected internal override bool RequiresAuthentication => true;

        public AdminApiDistributionBranchesRequest(string appId)
        {
            AppId = appId;
        }

        public string AppId { get; }
    }
}
