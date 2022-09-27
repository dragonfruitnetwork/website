// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;
using DragonFruit.Data.Parameters;

namespace DragonFruit.Sakura.Network.Requests
{
    public class AdminApiDistributionActiveReleaseRequest : YunaApiRequest
    {
        protected override string Stub => $"/{AppId}/dist/{BranchName}/releases/active";
        protected override bool RequireAuth => true;

        protected override Methods Method => Methods.Put;

        public AdminApiDistributionActiveReleaseRequest(string appId, string branchName, int activeReleaseId)
        {
            AppId = appId;
            BranchName = branchName;
            ActiveReleaseId = activeReleaseId;
        }

        public string AppId { get; }
        public string BranchName { get; }

        [FormParameter("release_id")]
        public int ActiveReleaseId { get; }

        [FormParameter("force")]
        protected bool Force => true;
    }
}
