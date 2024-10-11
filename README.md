# [MindR Telegram Bot](https://mindr.live/)

![open-graph](https://github.com/user-attachments/assets/58aca34f-9cfd-48c0-a0d0-acfd6973f13d)

MindR is a RAG-based (Retrieval-Augmented Generation) Telegram bot that allows users to store and retrieve text messages easily. Users can send any text message to the chat and later retrieve it using the `/ask` command followed by a query.

## Snapshots

![mindr](https://github.com/user-attachments/assets/1fdfa7bc-4309-43d2-b4b4-b7afddfa990b)

## Features

- Store text messages in a chat
- Retrieve messages using natural language queries
- Built with modern, efficient technologies

## Tech Stack

- **Runtime**: Bun
- **Framework**: Hono.js
- **Deployment**: Cloudflare Workers
- **Database**: Supabase PostgreSQL
- **AI**: Workers AI for embeddings and response generation

## Setup Instructions

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- A [Cloudflare](https://www.cloudflare.com/) account
- A [Supabase](https://supabase.com/) account
- A [Telegram Bot Token](https://core.telegram.org/bots#how-do-i-create-a-bot)

### Steps

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/mindr-telegram-bot.git
   cd mindr-telegram-bot
   ```

2. Install dependencies:

   ```
   bun install
   ```

3. Set up the Supabase database locally:
   ```
   bunx supabase init
   ```

- Make sure Docker is running.

  ```
  bunx supabase start

  bunx supabase migrations up

  ```

- Go to your supabase project dashboard and run this query in sql editor:

  ```
  select vault.create_secret(
      'YOUR_WORKERS_URL',
      'workers_url'
  );

  ```

4.  Set up environment variables:
    Create a `.dev.vars` file in the root directory and add the following:

    ````

        TELEGRAM_BOT_TOKEN=your_telegram_bot_token
        SUPABASE_URL=your_supabase_project_url
        SUPABASE_KEY=your_supabase_api_key

        ```

    ````

5.  Deploy to Cloudflare Workers:

    ```

    bun run deploy

    ```

6.  Set up the Telegram bot webhook:
    Replace `YOUR_WORKER_URL` with your Cloudflare Worker URL

    ````

        curl -F "url=YOUR_WORKER_URL" https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook

        ```
    ````

## Usage

1. Start a chat with your bot on Telegram
2. Send any text message to store it
3. Use the `/ask` command followed by your query to retrieve relevant messages
   Example: `/ask What did I say about project deadlines?`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
