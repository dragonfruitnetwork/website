// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;

namespace DragonFruit.Sakura.Network.Requests
{
    public abstract class YunaApiRequest : ApiRequest
    {
        public override string Path => $"{BaseUrlOverride.TrimEnd('/')}/{Stub.TrimStart('/')}";

        /// <summary>
        /// The base url to override. This will be set by the requesting client if not set.
        /// </summary>
        internal string BaseUrlOverride { get; set; }

        /// <summary>
        /// The request path.
        /// </summary>
        protected abstract string Stub { get; }

        internal bool RequiresInteractiveToken => RequireAuth;
    }
}
