// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using System.Text.RegularExpressions;
using DragonFruit.Sakura.Network;
using DragonFruit.Sakura.Wiki.Renderers;
using Markdig;
using Microsoft.AspNetCore.Components;
using SharpYaml.Serialization;

namespace DragonFruit.Sakura.Wiki
{
    public class WikiRenderer
    {
        private readonly MarkdownPipeline _pipeline;
        private readonly Serializer _yamlSerializer;

        private readonly Regex _pageFormat = new(@"^(?:---\r?\n(?<header>.*)---(?:\r?\n)+)?(?<document>.+)$", RegexOptions.Compiled | RegexOptions.Singleline);
        private readonly Regex _pageHeader = new(@"(?:#+ (.*))", RegexOptions.Compiled);

        public WikiRenderer()
        {
            _pipeline = new MarkdownPipelineBuilder()
                        .UseAdvancedExtensions()
                        .UseBootstrap()
                        .Use<AlertQuoteBlockRendererExtension>()
                        .Build();

            // ReSharper disable once UseObjectOrCollectionInitializer

            _yamlSerializer = new Serializer();
            _yamlSerializer.Settings.IgnoreUnmatchedProperties = true;
            _yamlSerializer.Settings.NamingConvention = new FlatNamingConvention();
        }

        /// <summary>
        /// Processes a <see cref="ApiWikiPage"/>, converting it into a usable <see cref="WikiPage"/>
        /// </summary>
        public WikiPage ProcessPage(ApiWikiPage apiPage)
        {
            var pageStructure = _pageFormat.Match(apiPage.PageContent);

            // process to get header
            var header = pageStructure.Groups["header"];
            var page = header.Success ? _yamlSerializer.Deserialize<WikiPage>(header.Value) : new WikiPage();

            // then get the content
            var rawContent = pageStructure.Groups["document"].Value;
            var titleCapture = _pageHeader.Match(rawContent).Groups[1];

            page.PagePath = apiPage.Path;
            page.Title = titleCapture.Success ? titleCapture.Value : "Wiki";
            page.Content = (MarkupString)Markdown.ToHtml(rawContent, _pipeline);

            return page;
        }
    }
}
