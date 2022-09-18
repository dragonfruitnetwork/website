// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;
using DragonFruit.Data.Extensions;
using DragonFruit.Data.Serializers.SystemJson;
using DragonFruit.Sakura.Network.Requests;
using Microsoft.AspNetCore.Components.WebAssembly.Authentication;

namespace DragonFruit.Sakura.Network
{
    public class SakuraClient : ApiClient<ApiSystemTextJsonSerializer>
    {
        private readonly IAccessTokenProvider _token;
        private AccessToken _lastToken;

        public SakuraClient(IAccessTokenProvider token)
        {
            _token = token;
        }

        protected override async Task ValidateRequest(ApiRequest request)
        {
            if (request is YunaApiRequest { RequiresInteractiveToken: true })
            {
                if (_lastToken == null || _lastToken.Expires.Subtract(DateTimeOffset.Now) < TimeSpan.FromMinutes(5))
                {
                    var newToken = await _token.RequestAccessToken().ConfigureAwait(false);

                    if (!newToken.TryGetToken(out _lastToken))
                    {
                        throw new AccessTokenNotAvailableException(null, newToken, Enumerable.Empty<string>());
                    }
                }

                request.WithAuthHeader($"Bearer {_lastToken.Value}");
            }

            await base.ValidateRequest(request).ConfigureAwait(false);
        }
    }
}
