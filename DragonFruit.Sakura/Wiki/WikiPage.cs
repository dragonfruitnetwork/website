// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using Microsoft.AspNetCore.Components;

namespace DragonFruit.Sakura.Wiki
{
    public class WikiPage
    {
        public string Title { get; set; }
        public string PagePath { get; set; }

        public bool Stub { get; set; }
        public bool Outdated { get; set; }
        public string[] Tags { get; set; }

        public MarkupString Content { get; set; }
    }
}
