// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;
using DragonFruit.Data.Serializers.SystemJson;
using DragonFruit.Sakura.Network.Requests;

namespace DragonFruit.Sakura.Network
{
    public abstract class SakuraClient : ApiClient<ApiSystemTextJsonSerializer>
    {
        public abstract bool IsServerSide { get; }

        protected virtual string ApiBaseUrl => "https://api.dragonfruit.network";

        protected override Task ValidateRequest(ApiRequest request)
        {
            if (request is YunaApiRequest yunaApiRequest && yunaApiRequest.BaseUrlOverride == null)
            {
                yunaApiRequest.BaseUrlOverride = ApiBaseUrl;
            }

            return base.ValidateRequest(request);
        }
    }
}
