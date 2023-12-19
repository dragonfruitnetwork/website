// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Text.Json.Serialization;

namespace DragonFruit.Sakura.Network
{
    public class OnionFruitGeolocationInfo
    {
        [JsonPropertyName("ip_address")]
        public string IPAddress { get; set; }

        [JsonPropertyName("country_code")]
        public string CountryCode { get; set; }

        [JsonPropertyName("country_name")]
        public string CountryName { get; set; }

        [JsonPropertyName("as_number")]
        public int? AS { get; set; }

        [JsonPropertyName("as_name")]
        public string ASName { get; set; }

        [JsonPropertyName("is_tor")]
        public bool? IsConnectedToTor { get; set; }
    }
}
