// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using Microsoft.AspNetCore.Mvc;

namespace DragonFruit.Sakura.Host
{
    [Route("/")]
    public class BlazorController : Controller
    {
        [HttpGet]
        public IActionResult Host() => View("~/Host.cshtml");
    }
}
