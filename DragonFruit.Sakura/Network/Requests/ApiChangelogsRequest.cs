// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class ApiChangelogsRequest(string appId, string versionName) : YunaApiRequest
    {
        protected override string Stub => $"/{AppId}/changelogs/{VersionName}";

        public string AppId { get; } = appId;
        public string VersionName { get; } = versionName ?? "latest";
    }
}
