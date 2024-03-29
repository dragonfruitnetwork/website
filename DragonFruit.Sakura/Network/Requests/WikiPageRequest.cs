﻿// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class WikiPageRequest(string pagePath) : YunaApiRequest
    {
        protected override string Stub => $"/wiki/en/{PagePath?.TrimStart('/')}";

        public string PagePath { get; } = pagePath;
    }
}
