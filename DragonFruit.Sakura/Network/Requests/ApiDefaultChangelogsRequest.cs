// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

namespace DragonFruit.Sakura.Network.Requests
{
    public partial class ApiDefaultChangelogsRequest : YunaApiRequest
    {
        protected override string Stub => "/changelogs/latest";
    }
}
