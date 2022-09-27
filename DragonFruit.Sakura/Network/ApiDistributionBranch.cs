// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Text.Json.Serialization;

namespace DragonFruit.Sakura.Network
{
    public class ApiDistributionBranch
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("app_id")]
        public string AppId { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("active_release_id")]
        public int ActiveReleaseId { get; set; }

        [JsonPropertyName("releases")]
        public IList<ApiDistributionRelease> Releases { get; set; }

        public override string ToString() => Name;
    }
}
