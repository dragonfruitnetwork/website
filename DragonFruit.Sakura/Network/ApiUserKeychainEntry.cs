// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Text.Json.Serialization;

namespace DragonFruit.Sakura.Network
{
    public class ApiUserKeychainEntry
    {
        [JsonPropertyName("jwk_fingerprint")]
        public string KeyId { get; set; }

        [JsonPropertyName("created_utc")]
        public DateTime CreatedUtc { get; set; }

        [JsonPropertyName("expiry_utc")]
        public DateTime? ExpiresUtc { get; set; }
    }
}
