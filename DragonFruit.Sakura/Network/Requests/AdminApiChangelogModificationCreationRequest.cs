// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;
using DragonFruit.Data.Parameters;

namespace DragonFruit.Sakura.Network.Requests
{
    public class AdminApiChangelogModificationCreationRequest : YunaApiRequest
    {
        protected override string Stub => $"/{AppId}/changelogs/{Version}/modifications";
        protected override bool RequireAuth => true;

        protected override Methods Method => Methods.Post;
        protected override BodyType BodyType => BodyType.SerializedProperty;

        public AdminApiChangelogModificationCreationRequest(string appId, string version, ApiChangelogModification modification)
        {
            AppId = appId;
            Version = version;
            Modification = modification;
        }

        public string AppId { get; }
        public string Version { get; }

        [RequestBody]
        public ApiChangelogModification Modification { get; }
    }
}
