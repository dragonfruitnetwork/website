// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;
using DragonFruit.Data.Requests;

namespace DragonFruit.Sakura.Network.Requests
{
    public abstract class YunaApiRequest : ApiRequest, IAsyncRequestExecutingCallback
    {
        public override string RequestPath => $"https://api.dragonfruit.network/{Stub.TrimStart('/')}";

        /// <summary>
        /// The request path.
        /// </summary>
        protected abstract string Stub { get; }

        /// <summary>
        /// Whether the request requires authentication.
        /// </summary>
        protected internal virtual bool RequiresAuthentication => false;

        [RequestParameter(ParameterType.Header, "Authorization")]
        protected internal string AuthenticationToken { get; set; }

        public ValueTask OnRequestExecuting(ApiClient client)
        {
            if (client is SakuraWasmClient wasmClient)
            {
                return wasmClient.EnsureAuthenticatedAsync(this);
            }

            return ValueTask.CompletedTask;
        }
    }
}
