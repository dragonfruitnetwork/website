// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class AdminApiDistributionReleaseDeletionRequest : YunaApiRequest
    {
        public override HttpMethod RequestMethod => HttpMethod.Delete;
        protected override string Stub => $"/{AppId}/dist/{BranchName}/releases/{ReleaseId}";

        protected internal override bool RequiresAuthentication => true;

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
