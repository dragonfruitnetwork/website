// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Text.Json.Serialization;

namespace DragonFruit.Sakura.Network
{
    public class ApiGeolocationInfo
    {
        [JsonPropertyName("ip_address")]
        public string IPAddress { get; set; }

        [JsonPropertyName("country_name")]
        public string Country { get; set; }

        [JsonPropertyName("is_tor")]
        public bool? IsConnectedToTor { get; set; }
    }
}
