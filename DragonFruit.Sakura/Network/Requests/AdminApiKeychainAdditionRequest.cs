// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data.Requests;

namespace DragonFruit.Sakura.Network.Requests
{
    [FormBodyType(FormBodyType.Multipart)]
    public partial class AdminApiKeychainAdditionRequest : YunaApiRequest
    {
        public override HttpMethod RequestMethod => HttpMethod.Post;
        protected override string Stub => "/users/me/keychain";

        protected internal override bool RequiresAuthentication => true;

        public AdminApiKeychainAdditionRequest(Stream pemFile, DateTime? expiry)
        {
            PublicKey = pemFile;
            Expiry = expiry;
        }

        [RequestParameter(ParameterType.Form, "pem")]
        public Stream PublicKey { get; }

        [RequestParameter(ParameterType.Form, "expiry")]
        public DateTime? Expiry { get; }
    }
}
