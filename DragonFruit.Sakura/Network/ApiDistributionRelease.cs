// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Text.Json.Serialization;

namespace DragonFruit.Sakura.Network
{
    public class ApiDistributionRelease
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("version_name")]
        public string Version { get; set; }

        [JsonPropertyName("files")]
        public IReadOnlyList<ApiDistributionFile> Files { get; set; }
    }
}
