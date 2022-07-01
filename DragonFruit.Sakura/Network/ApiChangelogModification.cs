// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Components;
using MudBlazor;

namespace DragonFruit.Sakura.Network
{
    public class ApiChangelogModification
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("release_id")]
        public int ReleaseId { get; set; }

        [JsonPropertyName("mod_type")]
        public ChangelogModificationType Type { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("category")]
        public string Category { get; set; }

        [JsonPropertyName("is_major")]
        public bool Major { get; set; }

        [JsonIgnore]
        public MarkupString HtmlDescription => (MarkupString)Description;

        [JsonIgnore]
        public string Icon => Type switch
        {
            ChangelogModificationType.Addition => Icons.Rounded.Add,
            ChangelogModificationType.Fix => Icons.Rounded.Check,
            ChangelogModificationType.Removal => Icons.Rounded.Remove,
            ChangelogModificationType.Delayed => Icons.Rounded.AccessTime,
            ChangelogModificationType.Info => Icons.Rounded.Info,
            ChangelogModificationType.KnownBug => Icons.Rounded.BugReport,

            _ => null
        };
    }
}
