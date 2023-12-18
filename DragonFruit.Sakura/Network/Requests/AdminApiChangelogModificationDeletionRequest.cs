// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class AdminApiChangelogModificationDeletionRequest(string appId, string version, int modificationId) : YunaApiRequest
    {
        public override HttpMethod RequestMethod => HttpMethod.Delete;
        protected override string Stub => $"/{AppId}/changelogs/{Version}/modifications/{ModificationId}";

        protected internal override bool RequiresAuthentication => true;

        public string AppId { get; } = appId;
        public string Version { get; } = version;
        public int ModificationId { get; } = modificationId;
    }
}
