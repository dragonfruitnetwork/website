// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using Markdig.Renderers;
using Markdig.Renderers.Html;
using Markdig.Syntax;

namespace DragonFruit.Sakura.Wiki.Renderers
{
    /// <summary>
    /// A HTML renderer for a <see cref="QuoteBlock"/> that produces a bootstrap alert box
    /// </summary>
    public class SakuraAlertRenderer : HtmlObjectRenderer<QuoteBlock>
    {
        protected override void Write(HtmlRenderer renderer, QuoteBlock obj)
        {
            renderer.EnsureLine();

            if (renderer.EnableHtmlForBlock)
            {
                // open content
                obj.GetAttributes().AddClass("mud-alert mud-alert-text-info mud-elevation-0");
                renderer.Write("<div").WriteAttributes(obj).WriteLine(">");

                // write icon
                renderer.WriteLine("<div class=\"mud-alert-icon mud-alert-icon-left\">");
                renderer.WriteLine("<i class=\"far fa-lightbulb\"></i>");
                renderer.WriteLine("</div>");

                // open message body
                renderer.WriteLine("<div class=\"mud-alert-message\">");
            }

            var savedImplicitParagraph = renderer.ImplicitParagraph;
            renderer.ImplicitParagraph = false;
            renderer.WriteChildren(obj);
            renderer.ImplicitParagraph = savedImplicitParagraph;

            if (renderer.EnableHtmlForBlock)
            {
                // close message body, content and container
                renderer.WriteLine("</div></div>");
            }

            renderer.EnsureLine();
        }
    }
}
