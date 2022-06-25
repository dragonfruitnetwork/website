// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Text.Json.Serialization;

namespace DragonFruit.Sakura.Network
{
    [Serializable]
    public class OnionCountryInfo
    {
        [JsonPropertyName("country_name")]
        public string CountryName { get; set; }

        [JsonPropertyName("country_code")]
        public string CountryCode { get; set; }

        [JsonPropertyName("node_count")]
        public int TotalNodeCount { get; set; }

        [JsonPropertyName("node_count_exit")]
        public int ExitNodeCount { get; set; }

        [JsonPropertyName("node_count_entry")]
        public int EntryNodeCount { get; set; }

        [JsonPropertyName("node_count_online")]
        public int OnlineNodeCount { get; set; }

        [JsonPropertyName("node_count_stable")]
        public int StableNodeCount { get; set; }

        [JsonPropertyName("node_count_fast")]
        public int FastNodeCount { get; set; }

        [JsonPropertyName("node_share")]
        public decimal GlobalShare { get; set; }
    }
}
