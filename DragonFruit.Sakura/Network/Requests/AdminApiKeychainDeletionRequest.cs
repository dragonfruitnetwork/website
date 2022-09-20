// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;

namespace DragonFruit.Sakura.Network.Requests
{
    public class AdminApiKeychainDeletionRequest : YunaApiRequest
    {
        protected override string Stub => $"/users/me/keychain/{KeyId}";
        protected override bool RequireAuth => true;

        protected override Methods Method => Methods.Delete;

        public AdminApiKeychainDeletionRequest(string keyId)
        {
            KeyId = keyId;
        }

        public string KeyId { get; }
    }
}
