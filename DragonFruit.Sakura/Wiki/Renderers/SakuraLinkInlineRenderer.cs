// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Text.RegularExpressions;
using Markdig.Renderers;
using Markdig.Renderers.Html.Inlines;
using Markdig.Syntax.Inlines;

namespace DragonFruit.Sakura.Wiki.Renderers
{
    public class SakuraLinkInlineRenderer : LinkInlineRenderer
    {
        protected override void Write(HtmlRenderer renderer, LinkInline link)
        {
            if (link.IsImage && (link.Url!.StartsWith("./") || link.Url.StartsWith('/')))
            {
                // replace image url with fully qualified one
                var path = Regex.Replace(link.Url, @"^\.?\/", string.Empty);
                link.Url = $"https://raw.githubusercontent.com/dragonfruitnetwork/wiki/master/{path}";
            }

            base.Write(renderer, link);
        }
    }
}
