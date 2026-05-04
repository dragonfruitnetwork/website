# DragonFruit Website
[![DragonFruit Discord](https://img.shields.io/discord/482528405292843018?label=Discord&style=popout)](https://discord.gg/VA26u5Z)

The new DragonFruit Website, built with Next.js, Tailwind CSS and shadcn/ui.

# Usage
Head to https://dragonfruit.network to use the website.

## Development
To run the website locally, you'll need the latest version of Node.js (Standard or LTS) installed, then clone the repository, configure the dotenv file and run the dev server:

```bash
git clone https://github.com/dragonfruitnetwork/website
cd website

npm ci

cp .env.example .env.local

# Edit .env.local with your preferred settings

npm run dev
```

## Services
This website uses a number of services to provide functionality.

### OnionFruit Web
This is the service that provides assets for the country listing and the connection status page. The source code for this service can be found in the [`onionfruit-web`](https://github.com/dragonfruitnetwork/onionfruit-web) repository.

### DragonFruit Wiki
A service that indexes the wiki contents and provides language-specific results for individual clients. The wiki contents can be found in the [`dragonfruit-wiki`](https://github.com/dragonfruitnetwork/wiki) repository. The indexing service source is currently not available.

### OAuth2
The website uses better-auth paired with Google OAuth2 for authentication. To get a OAuth2 client ID and secret, you can create a project in the [Google Cloud Console](https://console.cloud.google.com/), enable the "Google Identity Platform" API, and create OAuth2 credentials. Make sure to set the authorized redirect URI to `https://yourdomain.com/api/auth/callback/google`.

# License
The DragonFruit Website is licensed under AGPL version 3 or later. Refer to [the licence file](license.md) for more information. As a general guide, if you want to use any resource from this project, you must open source your project under the same licence and provide attribution.
Note this doesn't include the DragonFruit Network name or logo, as these shouldn't be used.
