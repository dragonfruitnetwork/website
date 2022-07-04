// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using Microsoft.AspNetCore.Components;
using SharpYaml.Serialization;

namespace DragonFruit.Sakura.Wiki
{
    public class WikiPageContent
    {
        public string Title { get; set; }
        public string PagePath { get; set; }
        public MarkupString Content { get; set; }

        [YamlMember("stub")]
        public bool Stub { get; set; }

        [YamlMember("outdated")]
        public bool Outdated { get; set; }

        [YamlMember("tags")]
        public List<string> Tags { get; set; }
    }
}
