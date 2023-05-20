// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Net;
using System.Net.Http;
using DragonFruit.Sakura.Network;

namespace DragonFruit.Sakura.Host
{
    public class SakuraServerClient : SakuraClient
    {
        public override bool IsServerSide => true;

        public SakuraServerClient()
        {
            UserAgent = "Sakura-Server";
            Handler = () => new SocketsHttpHandler
            {
                AutomaticDecompression = DecompressionMethods.All
            };
        }
    }
}
