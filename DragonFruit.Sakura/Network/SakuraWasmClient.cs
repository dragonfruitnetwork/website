// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Sakura.Network.Requests;
using Microsoft.AspNetCore.Components.WebAssembly.Authentication;

namespace DragonFruit.Sakura.Network
{
    public class SakuraWasmClient(IAccessTokenProvider token) : SakuraClient
    {
        private AccessToken _lastToken;

        public override bool IsServerSide => false;

        protected override HttpClient CreateClient() => new();

        internal async ValueTask EnsureAuthenticatedAsync(YunaApiRequest request)
        {
            if (request.RequiresAuthentication)
            {
                if (_lastToken == null || _lastToken.Expires.Subtract(DateTimeOffset.Now) < TimeSpan.FromMinutes(5))
                {
                    var newToken = await token.RequestAccessToken().ConfigureAwait(false);

                    if (!newToken.TryGetToken(out _lastToken))
                    {
                        throw new AccessTokenNotAvailableException(null, newToken, Enumerable.Empty<string>());
                    }
                }

                request.AuthenticationToken = $"Bearer {_lastToken.Value}";
            }
        }
    }
}
