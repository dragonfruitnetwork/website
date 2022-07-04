// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Text.Json.Serialization;

namespace DragonFruit.Sakura.Network
{
    public class ApiWikiPage
    {
        [JsonPropertyName("path")]
        public string Path { get; set; }

        [JsonPropertyName("page_locale")]
        public string Locale { get; set; }

        [JsonPropertyName("page_content")]
        public string Content { get; set; }

        [JsonPropertyName("github_url")]
        public string GitHubPageUrl { get; set; }

        [JsonPropertyName("github_commit_url")]
        public string GitHubCommitUrl { get; set; }

        [JsonPropertyName("last_commit_message")]
        public string LastCommitMessage { get; set; }

        [JsonPropertyName("last_updated")]
        public DateTimeOffset LastUpdated { get; set; }

        [JsonPropertyName("locales_available")]
        public IReadOnlyCollection<string> AvailableLocales { get; set; }

        [JsonPropertyName("authors")]
        public IReadOnlyCollection<ApiWikiContributor> Authors { get; set; }
    }
}
