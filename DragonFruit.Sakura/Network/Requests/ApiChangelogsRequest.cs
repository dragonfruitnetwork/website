// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public class ApiChangelogsRequest : YunaApiRequest
    {
        protected override string Stub => $"/{AppId}/changelogs/{VersionName}";

        public ApiChangelogsRequest(string appId, string versionName)
        {
            AppId = appId;
            VersionName = versionName ?? "latest";
        }

        public string AppId { get; }
        public string VersionName { get; }
    }
}
