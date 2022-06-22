using DragonFruit.Data;

namespace DragonFruit.Sakura.Network.Requests;

public class ApiDefaultChangelogsRequest : ApiRequest
{
    public override string Path => "https://dragonfruit.network/api/changelogs/latest";
}