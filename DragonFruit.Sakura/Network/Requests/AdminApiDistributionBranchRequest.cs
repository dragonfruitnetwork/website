// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public class AdminApiDistributionBranchRequest : YunaApiRequest
    {
        protected override string Stub => $"/{AppId}/dist/{BranchName}";
        protected override bool RequireAuth => true;

        public AdminApiDistributionBranchRequest(string appId, string branchName)
        {
            AppId = appId;
            BranchName = branchName;
        }

        public string AppId { get; }
        public string BranchName { get; }
    }
}
