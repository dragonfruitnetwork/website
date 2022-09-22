// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;
using DragonFruit.Data.Parameters;

namespace DragonFruit.Sakura.Network.Requests
{
    public class AdminApiDistributionBranchCreationRequest : YunaApiRequest
    {
        protected override string Stub => $"/{AppId}/dist/branches";
        protected override bool RequireAuth => true;

        protected override Methods Method => Methods.Post;

        public AdminApiDistributionBranchCreationRequest(string appId, string branchName)
        {
            AppId = appId;
            BranchName = branchName;
        }

        public string AppId { get; }

        [FormParameter("name")]
        public string BranchName { get; }
    }
}
