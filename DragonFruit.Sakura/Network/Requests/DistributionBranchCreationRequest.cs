// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data.Requests;

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class DistributionBranchCreationRequest(string appId, string branchName) : YunaApiRequest
    {
        public override HttpMethod RequestMethod => HttpMethod.Post;
        protected override string Stub => $"/{AppId}/dist/branches";

        protected internal override bool RequiresAuthentication => true;

        public string AppId { get; } = appId;

        [RequestParameter(ParameterType.Form, "name")]
        public string BranchName { get; } = branchName;
    }
}
