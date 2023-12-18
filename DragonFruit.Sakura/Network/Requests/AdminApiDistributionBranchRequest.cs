// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class AdminApiDistributionBranchRequest : YunaApiRequest
    {
        protected override string Stub => $"/{AppId}/dist/{BranchName}";

        protected internal override bool RequiresAuthentication => true;

        public AdminApiDistributionBranchRequest(string appId, string branchName)
        {
            AppId = appId;
            BranchName = branchName;
        }

        public string AppId { get; }
        public string BranchName { get; }
    }
}
