// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Text.Json;
using System.Text.Json.Serialization;
using DragonFruit.Data;
using DragonFruit.Data.Serializers;

namespace DragonFruit.Sakura.Network
{
    public abstract class SakuraClient : ApiClient<ApiJsonSerializer>
    {
        protected SakuraClient()
        {
            Serializers.Configure<ApiJsonSerializer>(j => j.SerializerOptions = new JsonSerializerOptions
            {
                TypeInfoResolverChain = { SakuraSerializerContext.Default }
            });
        }

        public abstract bool IsServerSide { get; }

        protected internal virtual string ApiBaseUrl => "https://api.dragonfruit.network";
    }

    [
        JsonSerializable(typeof(IReadOnlyList<ApiAppInfo>)),

        JsonSerializable(typeof(ApiUserKeychainEntry)),
        JsonSerializable(typeof(IReadOnlyCollection<ApiUserKeychainEntry>)),

        JsonSerializable(typeof(ApiChangelogRelease)),
        JsonSerializable(typeof(ApiChangelogModification)),
        JsonSerializable(typeof(IReadOnlyCollection<ApiChangelogRelease>)),

        JsonSerializable(typeof(ApiDistributionBranch)),
        JsonSerializable(typeof(IList<ApiDistributionBranch>)),

        JsonSerializable(typeof(OnionFruitGeolocationInfo))
    ]
    public partial class SakuraSerializerContext : JsonSerializerContext;
}
