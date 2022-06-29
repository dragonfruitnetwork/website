// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using Markdig;
using Markdig.Renderers;
using Markdig.Renderers.Html;
using Markdig.Syntax;

namespace DragonFruit.Sakura.Wiki.Renderers
{
    /// <summary>
    /// A HTML renderer for a <see cref="QuoteBlock"/> that produces a bootstrap alert box
    /// </summary>
    public class AlertQuoteBlockRenderer : HtmlObjectRenderer<QuoteBlock>
    {
        protected override void Write(HtmlRenderer renderer, QuoteBlock obj)
        {
            renderer.EnsureLine();

            if (renderer.EnableHtmlForBlock)
            {
                obj.GetAttributes().AddClass("alert alert-primary d-flex align-items-center");
                renderer.Write("<div").WriteAttributes(obj).WriteLine(">");
                renderer.WriteLine("<i class=\"far fa-lightbulb mr-3 text-secondary\"></i>");
            }

            var savedImplicitParagraph = renderer.ImplicitParagraph;
            renderer.ImplicitParagraph = false;
            renderer.WriteChildren(obj);
            renderer.ImplicitParagraph = savedImplicitParagraph;

            if (renderer.EnableHtmlForBlock)
            {
                renderer.WriteLine("</div>");
            }

            renderer.EnsureLine();
        }
    }

    public class AlertQuoteBlockRendererExtension : IMarkdownExtension
    {
        public void Setup(MarkdownPipelineBuilder pipeline)
        {
            throw new NotSupportedException();
        }

        public void Setup(MarkdownPipeline pipeline, IMarkdownRenderer renderer)
        {
            // swap the built-in renderer with our own
            renderer.ObjectRenderers.Replace<QuoteBlockRenderer>(new AlertQuoteBlockRenderer());
        }
    }
}
