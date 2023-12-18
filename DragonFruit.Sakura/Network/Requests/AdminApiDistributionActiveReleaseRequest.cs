// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data.Requests;

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class AdminApiDistributionActiveReleaseRequest : YunaApiRequest
    {
        public override HttpMethod RequestMethod => HttpMethod.Put;
        protected override string Stub => $"/{AppId}/dist/{BranchName}/releases/active";

        protected internal override bool RequiresAuthentication => true;

        public AdminApiDistributionActiveReleaseRequest(string appId, string branchName, int activeReleaseId)
        {
            AppId = appId;
            BranchName = branchName;
            ActiveReleaseId = activeReleaseId;
        }

        public string AppId { get; }
        public string BranchName { get; }

        [RequestParameter(ParameterType.Form, "release_id")]
        public int ActiveReleaseId { get; }

        [RequestParameter(ParameterType.Form, "force")]
        protected bool Force => true;
    }
}
