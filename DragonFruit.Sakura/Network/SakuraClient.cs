// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;
using DragonFruit.Data.Serializers;

namespace DragonFruit.Sakura.Network
{
    public abstract class SakuraClient : ApiClient<ApiJsonSerializer>
    {
        public abstract bool IsServerSide { get; }

        protected internal virtual string ApiBaseUrl => "https://api.dragonfruit.network";
    }
}
