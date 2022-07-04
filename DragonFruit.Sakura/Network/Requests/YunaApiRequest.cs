// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;

namespace DragonFruit.Sakura.Network.Requests
{
    public abstract class YunaApiRequest : ApiRequest
    {
        private const string ApiEndpoint = "https://api.dragonfruit.network";

        public override string Path => $"{ApiEndpoint}/{Stub.TrimStart('/')}";

        /// <summary>
        /// The request path.
        /// </summary>
        protected abstract string Stub { get; }
    }
}
