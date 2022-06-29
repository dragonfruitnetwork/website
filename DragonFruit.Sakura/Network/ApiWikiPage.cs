// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Text.Json.Serialization;

namespace DragonFruit.Sakura.Network
{
    public class ApiWikiPage
    {
        [JsonPropertyName("path")]
        public string Path { get; set; }

        [JsonPropertyName("page_content")]
        public string PageContent { get; set; }
    }
}
