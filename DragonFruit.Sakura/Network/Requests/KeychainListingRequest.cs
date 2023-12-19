// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data.Requests;

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class KeychainListingRequest : YunaApiRequest
    {
        protected override string Stub => "/users/me/keychain";
        protected internal override bool RequiresAuthentication => true;

        [RequestParameter(ParameterType.Query, "offset")]
        public int? Offset { get; set; }

        [RequestParameter(ParameterType.Query, "limit")]
        public int? Limit { get; set; }
    }
}
