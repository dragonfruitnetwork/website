// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;

namespace DragonFruit.Sakura.Network.Requests
{
    public class AdminApiKeychainAdditionRequest : YunaApiRequest
    {
        protected override string Stub => "/users/me/keychain";
        protected override bool RequireAuth => true;

        protected override Methods Method => Methods.Post;
        protected override BodyType BodyType => BodyType.Custom;

        public AdminApiKeychainAdditionRequest(Stream pemFile, DateTime? expiry)
        {
            PublicKey = pemFile;
            Expiry = expiry;
        }

        public Stream PublicKey { get; }
        public DateTime? Expiry { get; }

        protected override HttpContent BodyContent
        {
            get
            {
                var multipartBody = new MultipartFormDataContent();
                multipartBody.Add(new StreamContent(PublicKey), "pem");

                if (Expiry.HasValue)
                {
                    multipartBody.Add(new StringContent(Expiry.Value.ToString("O")), "expiry");
                }

                return multipartBody;
            }
        }
    }
}
