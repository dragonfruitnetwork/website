// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Text.Json.Serialization;

namespace DragonFruit.Sakura.Network
{
    public class OnionFruitGeolocationInfo
    {
        [JsonPropertyName("ipAddress")]
        public string IPAddress { get; set; }

        [JsonPropertyName("countryCode")]
        public string CountryCode { get; set; }

        [JsonPropertyName("countryName")]
        public string CountryName { get; set; }

        [JsonPropertyName("asNumber")]
        public int? AS { get; set; }

        [JsonPropertyName("asName")]
        public string ASName { get; set; }

        [JsonPropertyName("isTor")]
        public bool? IsConnectedToTor { get; set; }
    }
}
