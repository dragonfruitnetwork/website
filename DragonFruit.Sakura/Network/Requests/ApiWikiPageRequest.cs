// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public class ApiWikiPageRequest : YunaApiRequest
    {
        protected override string Stub => $"/wiki/en/{PagePath?.TrimStart('/')}";

        public ApiWikiPageRequest(string pagePath)
        {
            PagePath = pagePath;
        }

        public string PagePath { get; }
    }
}
