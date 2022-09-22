// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;

namespace DragonFruit.Sakura.Network.Requests
{
    public class AdminApiDistributionReleaseDeletionRequest : YunaApiRequest
    {
        protected override string Stub => $"/{AppId}/dist/{BranchName}/releases/{ReleaseId}";
        protected override bool RequireAuth => true;

        protected override Methods Method => Methods.Delete;

        public AdminApiDistributionReleaseDeletionRequest(string appId, string branchName, int releaseId)
        {
            AppId = appId;
            BranchName = branchName;
            ReleaseId = releaseId;
        }

        public string AppId { get; }
        public string BranchName { get; }
        public int ReleaseId { get; }
    }
}
