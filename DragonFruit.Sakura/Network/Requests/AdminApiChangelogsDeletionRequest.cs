// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class AdminApiChangelogsDeletionRequest(string appId, string versionName) : YunaApiRequest
    {
        public override HttpMethod RequestMethod => HttpMethod.Delete;
        protected override string Stub => $"/{AppId}/changelogs/{VersionName}";

        protected internal override bool RequiresAuthentication => true;

        public string AppId { get; } = appId;
        public string VersionName { get; } = versionName;
    }
}
