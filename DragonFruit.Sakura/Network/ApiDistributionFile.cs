// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Text.Json.Serialization;

namespace DragonFruit.Sakura.Network
{
    public class ApiDistributionFile
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("sha256")]
        public string Hash { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("validated")]
        public bool Validated { get; set; }
    }
}
