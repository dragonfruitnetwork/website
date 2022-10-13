
# DragonFruit Sakura
[![DragonFruit Discord](https://img.shields.io/discord/482528405292843018?label=Discord&style=popout)](https://discord.gg/VA26u5Z)

The new DragonFruit website.

## Status
While this is currently online it is still being built. Most important differences compared to the old site are better layouts and mobile usability is significantly better.

Bug reports are being accepted (provided they provide enough detail to diagnose the issue), and can be opened using GitHub issues. Feature requests are welcome, but will be low priority until the main site has been built to match the legacy site (codenamed Yuna).

The latest release of the site can be found at https://dragonfruit.network

## Development
Sakura is built using ASP.NET Blazor WebAssembly using [MudBlazor](https://mudblazor.com/) as the component design provider. It runs almost entirely client-side with Yuna providing an API to provide data as needed.

To build/test/develop a copy of Sakura make sure you have the following prerequisites:

- A desktop with [.NET 6 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/6.0).
  - If you're using Visual Studio 2022, ensure the **ASP.NET and web development** workload is installed
  - Otherwise, ensure the `wasm-tools` workload is installed (`dotnet workload install wasm-tools`)
- An IDE you're comfortable with. We recommend using [JetBrains Rider](https://www.jetbrains.com/rider/) or [ReSharper](https://www.jetbrains.com/resharper/) and Visual Studio to access improved code formatting and styling suggestions.  
- A modern browser. [CanIUse](https://caniuse.com/wasm) says 95+% of browsers support WebAssembly, so this shouldn't be an issue
- You can access `localhost` on your computer. If you can't some pages won't work due to the warning below

**Warning:** CORS is enabled on our API to only allow requests from `localhost` (debugging) and `*.dragonfruit.network` (production).
Deploying your own copy on a custom domain may result in some features not working as expected.

### Downloading source code
Clone the repo using git:
```
git clone https://github.com/dragonfruitnetwork/sakura DragonFruit.Sakura
cd DragonFruit.Sakura
```
Double-clicking the `.sln` or a `.csproj` file inside the folder should open your IDE with all the files listed in a sidebar. VS Code users may need to open the project as a folder instead before being able to view the structure.

### Building the project

We bundle a `launchSettings.json` file which should work with all IDEs mentioned in this file. You should use the build/run functionality provided by your IDE to get started. If your IDE won't build or run the project, you can run the following command in the folder containing the `.sln` file
```
dotnet run --project DragonFruit.Sakura
```

If you're not interested in debugging, you can add `-c Release` onto the end of the command to get a "Release" copy. This may take longer to build because of optimisations but will result in smaller binaries/faster performance.

## Contributing

Contributions are welcome in multiple forms. The main ways you can contribute are testing the site and reporting bugs, or providing changes through pull requests. 

While we do have a structure already in place, if you feel it is wrong or should be changed, feel free to bring it up in an issue. The same applies to any libraries we're using and build/test procedures.
Feedback is welcome and helps the project advance and enables more people to get involved.

## License
DragonFruit Sakura is licensed under AGPL version 3 or later. Refer to [the licence file](license.md) for more information. In short, if you want to use any resource from this project, you must open source your project under the same licence and provide attribution.Note this doesn't include the DragonFruit Network name or logo, these shouldn't be used.

If you are unsure about any of the license terms, drop us a line at inbox@dragonfruit.network or join our [Discord](https://discord.gg/VA26u5Z) server and ask there.
