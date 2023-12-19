// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class KeychainItemDeletionRequest : YunaApiRequest
    {
        public override HttpMethod RequestMethod => HttpMethod.Delete;
        protected override string Stub => $"/users/me/keychain/{KeyId}";

        protected internal override bool RequiresAuthentication => true;

        public KeychainItemDeletionRequest(string keyId)
        {
            KeyId = keyId;
        }

        public string KeyId { get; }
    }
}
