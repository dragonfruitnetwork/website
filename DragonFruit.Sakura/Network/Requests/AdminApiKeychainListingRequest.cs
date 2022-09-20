// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data.Parameters;

namespace DragonFruit.Sakura.Network.Requests
{
    public class AdminApiKeychainListingRequest : YunaApiRequest
    {
        protected override string Stub => "/users/me/keychain";
        protected override bool RequireAuth => true;

        [QueryParameter("offset")]
        public int? Offset { get; set; }

        [QueryParameter("limit")]
        public int? Limit { get; set; }
    }
}
