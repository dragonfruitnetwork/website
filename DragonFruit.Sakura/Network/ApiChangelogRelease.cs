// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Text.Json.Serialization;

namespace DragonFruit.Sakura.Network
{
    [Serializable]
    public class ApiChangelogRelease
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("target_app")]
        public string AppId { get; set; }

        [JsonPropertyName("app_name")]
        public string AppName { get; set; }

        [JsonPropertyName("released")]
        public DateTime Release { get; set; }

        [JsonPropertyName("version_name")]
        public string VersionName { get; set; }

        [JsonPropertyName("next_id")]
        public string NextRelease { get; set; }

        [JsonPropertyName("prev_id")]
        public string PreviousRelease { get; set; }

        [JsonPropertyName("modifications")]
        public IList<ApiChangelogModification> Modifications { get; set; }
    }
}
