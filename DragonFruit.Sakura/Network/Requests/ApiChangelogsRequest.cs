using DragonFruit.Data;

namespace DragonFruit.Sakura.Network.Requests
{
    public class ApiChangelogsRequest : ApiRequest
    {
        public override string Path => $"https://dragonfruit.network/api/{AppName}/changelogs/{VersionName}";

        public ApiChangelogsRequest(string appName, string versionName)
        {
            AppName = appName;
            VersionName = versionName;
        }

        public string AppName { get; }
        public string VersionName { get; }
    }
}