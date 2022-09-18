// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Text.Json.Serialization;

namespace DragonFruit.Sakura.Network
{
    public class ApiAppInfo
    {
        [JsonPropertyName("app_id")]
        public string Id { get; set; }

        [JsonPropertyName("app_name")]
        public string Name { get; set; }

        [JsonPropertyName("app_features")]
        public AppFeatures Features { get; set; }
    }

    public enum AppFeatures
    {
        Changelogs = 1,
        Distribution = 2
    }
}
