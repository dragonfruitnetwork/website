// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data.Requests;

namespace DragonFruit.Sakura.Network.Requests
{
    [FormBodyType(FormBodyType.Multipart)]
    public partial class KeychainItemAdditionRequest(Stream pemFile, DateTime? expiry) : YunaApiRequest
    {
        public override HttpMethod RequestMethod => HttpMethod.Post;
        protected override string Stub => "/users/me/keychain";

        protected internal override bool RequiresAuthentication => true;

        [RequestParameter(ParameterType.Form, "pem")]
        public Stream PublicKey { get; } = pemFile;

        [RequestParameter(ParameterType.Form, "expiry")]
        public DateTime? Expiry { get; } = expiry;
    }
}
