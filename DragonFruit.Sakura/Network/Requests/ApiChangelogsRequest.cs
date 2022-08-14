// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public class ApiChangelogsRequest : YunaApiRequest
    {
        protected override string Stub => $"/{AppName}/changelogs/{VersionName}";

        public ApiChangelogsRequest(string appName, string versionName)
        {
            AppName = appName;
            VersionName = versionName ?? "latest";
        }

        public string AppName { get; }
        public string VersionName { get; }
    }
}
