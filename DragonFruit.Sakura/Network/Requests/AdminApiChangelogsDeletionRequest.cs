// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;

namespace DragonFruit.Sakura.Network.Requests
{
    public class AdminApiChangelogsDeletionRequest : YunaApiRequest
    {
        protected override string Stub => $"/{AppId}/changelogs/{VersionName}";
        protected override bool RequireAuth => true;

        protected override Methods Method => Methods.Delete;

        public AdminApiChangelogsDeletionRequest(string appId, string versionName)
        {
            AppId = appId;
            VersionName = versionName;
        }

        public string AppId { get; }
        public string VersionName { get; }
    }
}
