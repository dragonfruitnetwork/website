﻿// DragonFruit Sakura Copyright (c) DragonFruit Network <inbox@dragonfruit.network>
// Licensed under GNU AGPLv3. Refer to the LICENSE file for more info

using DragonFruit.Data;
using DragonFruit.Data.Parameters;

namespace DragonFruit.Sakura.Network.Requests
{
    public class AdminApiChangelogModificationEditRequest : YunaApiRequest
    {
        protected override string Stub => $"/{AppId}/changelogs/{Version}/modifications/{Modification.Id}";
        protected override bool RequireAuth => true;

        protected override Methods Method => Methods.Patch;
        protected override BodyType BodyType => BodyType.SerializedProperty;

        public AdminApiChangelogModificationEditRequest(string appId, string version, ApiChangelogModification modification)
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