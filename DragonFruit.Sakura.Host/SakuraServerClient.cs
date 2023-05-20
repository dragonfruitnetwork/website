// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Net;
using System.Net.Http;
using DragonFruit.Sakura.Network;
using Microsoft.Extensions.Configuration;

namespace DragonFruit.Sakura.Host
{
    public class SakuraServerClient : SakuraClient
    {
        private readonly string _yunaUrl;

        public override bool IsServerSide => true;

        protected override string ApiBaseUrl => _yunaUrl ?? base.ApiBaseUrl;

        public SakuraServerClient(IConfiguration config)
        {
            _yunaUrl = config["YUNA_API_URL"];

            UserAgent = "Sakura-Server";
            Handler = () => new SocketsHttpHandler
            {
                AutomaticDecompression = DecompressionMethods.All
            };
        }
    }
}
