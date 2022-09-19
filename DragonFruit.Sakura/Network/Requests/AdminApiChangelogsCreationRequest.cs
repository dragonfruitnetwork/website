// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;
using DragonFruit.Data.Parameters;

namespace DragonFruit.Sakura.Network.Requests
{
    public class AdminApiChangelogsCreationRequest : YunaApiRequest
    {
        protected override string Stub => $"/{AppId}/changelogs";
        protected override bool RequireAuth => true;

        protected override Methods Method => Methods.Post;
        protected override BodyType BodyType => BodyType.SerializedProperty;

        public AdminApiChangelogsCreationRequest(string appId, ApiChangelogRelease release)
        {
            AppId = appId;
            Release = release;
        }

        public string AppId { get; }

        [RequestBody]
        public ApiChangelogRelease Release { get; }
    }
}
