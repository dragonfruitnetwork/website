// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class DistributionReleaseDeletionRequest(string appId, string branchName, int releaseId) : YunaApiRequest
    {
        public override HttpMethod RequestMethod => HttpMethod.Delete;
        protected override string Stub => $"/{AppId}/dist/{BranchName}/releases/{ReleaseId}";

        protected internal override bool RequiresAuthentication => true;

        public string AppId { get; } = appId;
        public string BranchName { get; } = branchName;
        public int ReleaseId { get; } = releaseId;
    }
}
