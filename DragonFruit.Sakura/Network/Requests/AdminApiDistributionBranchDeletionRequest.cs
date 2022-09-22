// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;

namespace DragonFruit.Sakura.Network.Requests
{
    public class AdminApiDistributionBranchDeletionRequest : YunaApiRequest
    {
        protected override string Stub => $"/{AppId}/dist/branches/{BranchName}";
        protected override bool RequireAuth => true;

        protected override Methods Method => Methods.Delete;

        public AdminApiDistributionBranchDeletionRequest(string appId, string branchName)
        {
            AppId = appId;
            BranchName = branchName;
        }

        public string AppId { get; }
        public string BranchName { get; }
    }
}
