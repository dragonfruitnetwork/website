// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;

namespace DragonFruit.Sakura.Network.Requests
{
    public class AdminApiChangelogModificationDeletionRequest : YunaApiRequest
    {
        protected override string Stub => $"/{AppId}/changelogs/{Version}/modifications/{ModificationId}";
        protected override bool RequireAuth => true;

        protected override Methods Method => Methods.Delete;

        public AdminApiChangelogModificationDeletionRequest(string appId, string version, int modificationId)
        {
            AppId = appId;
            Version = version;
            ModificationId = modificationId;
        }

        public string AppId { get; }
        public string Version { get; }
        public int ModificationId { get; }
    }
}
