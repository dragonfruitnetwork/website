// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;

namespace DragonFruit.Sakura.Network.Requests
{
    public class ApiWikiPageRequest : ApiRequest
    {
        public override string Path => $"https://dragonfruit.network/api/wiki/{PagePath.TrimStart('/')}";

        public ApiWikiPageRequest(string pagePath)
        {
            PagePath = pagePath;
        }

        public string PagePath { get; }
    }
}
