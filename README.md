<div align="center">
  <img alt="Halcyon" src="https://app-artworks.sfo3.digitaloceanspaces.com/theartofuslogo.png" width="100" />
</div>
<h1 align="center">
  The Art Of Us
</h1>
<p align="center">
  A beginner focused, art sharing full-stack web app
</p>

![alt text](https://i.imgur.com/JxQG89i.png)

Hello! This is my first official _big_ project that I am currently building and improving on daily. This beginner focused, art sharing full-stack web app was built primarily with [React.js](https://reactjs.org/), [Next.js](https://nextjs.org/) and [Prisma](https://www.prisma.io/). I took inspiration from [Artstation](https://www.artstation.com/). I focused on creating a similar site that revolves around supporting users who are still in the process of learning how to draw, whereas Artstation focuses on professional artists who are sharing their portfolio for employment. In its current state, users can upload their artworks, comment and like on other artworks, and follow each other. User's uploaded artworks are saved onto a [Digital Ocean Space](https://www.digitalocean.com/products/spaces) and user's information is saved onto a [Postgres](https://www.postgresql.org/) database, hosted on [Supabase](https://supabase.com/). User authentication is done with [Google](https://next-auth.js.org/providers/google) via [Next-Auth](https://next-auth.js.org/), but I do plan on making more methods of authentication available.

There is still a lot to do such as refactoring the code, adding proper error handling and especially improving the use of TypeScript. This was my first time using TypeScript and I temporarily set strict typing to false within the tsconfig in order to get the code to execute. The site will be eventually have its colors and components restyled, but for now I am mainly focused on functionality.

### Built with:

-   [React.js](https://reactjs.org/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Next.js](https://nextjs.org/)
-   [Prisma](https://www.prisma.io/)
-   [Next-Auth.js](https://next-auth.js.org/)
-   [TailwindCSS](https://tailwindcss.com/)
-   [SWR](https://swr.vercel.app/)
-   [React-Hook-Form](https://react-hook-form.com/)
-   [PostgreSQL](https://www.postgresql.org/)

## Setup

[The Art Of Us](https://theartofus.vercel.app/) is currently live but if interested in running it locally, you would need to setup a [Digital Ocean Space](https://www.digitalocean.com/products/spaces) and obtain a space access key & secret, register OAuth 2.0 authorization with [Google](https://developers.google.com/identity/protocols/oauth2) and setup a PostgreSQL server with [Supabase](https://supabase.com/docs/guides/database) by starting a new project there.

1. Install dependencies

    ```bash
    npm install
    ```

2. Create and set environmental variables within .env in root directory

    ```bash
    DATABASE_URL = db-connection-url-from-supabase-pgbouncer=true
    GOOGLE_CLIENT_ID = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    GOOGLE_CLIENT_SECRET = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    JWT_SECRET = your-own-secret-string
    DO_SPACES_ID = digital-ocean-generated-space-access-key
    DO_SPACES_SECRET = digital-ocean-generated-space-access-secret
    DO_SPACES_URL = digital-ocean-space-url
    DO_SPACES_BUCKET = digital-ocean-space-name
    ```

3. Within the credentials settings of the [Google App](https://console.developers.google.com/) you recently created in your dashboard, create an OAuth 2.0 Client ID and add the following under the authorized redirect URI's section

    ```bash
    http://localhost:3000/api/auth/callback/google
    ```

4. Generate and migrate the Prisma schema over to your Postgres database

    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

5. Start development server

    ```bash
    npm run dev
    ```
