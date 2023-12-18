// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data.Requests;

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class AdminApiChangelogModificationEditRequest : YunaApiRequest
    {
        public override HttpMethod RequestMethod => HttpMethod.Patch;
        protected override string Stub => $"/{AppId}/changelogs/{Version}/modifications/{Modification.Id}";

        protected internal override bool RequiresAuthentication => true;

        public AdminApiChangelogModificationEditRequest(string appId, string version, ApiChangelogModification modification)
        {
            AppId = appId;
            Version = version;
            Modification = modification;
        }

        public string AppId { get; }
        public string Version { get; }

        [RequestBody]
        public ApiChangelogModification Modification { get; }
    }
}
