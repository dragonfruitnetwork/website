// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data.Requests;

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class AdminApiChangelogModificationCreationRequest(string appId, string version, ApiChangelogModification modification) : YunaApiRequest
    {
        public override HttpMethod RequestMethod => HttpMethod.Post;
        protected override string Stub => $"/{AppId}/changelogs/{Version}/modifications";

        protected internal override bool RequiresAuthentication => true;

        public string AppId { get; } = appId;
        public string Version { get; } = version;

        [RequestBody]
        public ApiChangelogModification Modification { get; } = modification;
    }
}
