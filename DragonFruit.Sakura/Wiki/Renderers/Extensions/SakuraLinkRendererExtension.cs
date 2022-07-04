// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using Markdig;
using Markdig.Renderers;
using Markdig.Renderers.Html.Inlines;

namespace DragonFruit.Sakura.Wiki.Renderers.Extensions
{
    public class SakuraLinkRendererExtension : IMarkdownExtension
    {
        public void Setup(MarkdownPipelineBuilder pipeline)
        {
            // do nothing
        }

        public void Setup(MarkdownPipeline pipeline, IMarkdownRenderer renderer)
        {
            // swap the built-in renderer with our own
            renderer.ObjectRenderers.Replace<LinkInlineRenderer>(new SakuraLinkInlineRenderer());
        }
    }
}
