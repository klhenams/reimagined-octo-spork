# A simple Concurrent File Server

We only have two routes, obviously, `download` and `upload`.

They both exist on the routes:

Upload:
`[GIN-debug] POST   /api/file/upload          --> file-server/api/controllers.UploadHandler (3 handlers)`

Download:
`[GIN-debug] GET    /api/file/download/:shortLink --> file-server/api/controllers.DownloadHandler (3 handlers)`

## Environment Variables

You can easily configure this server with the information from the `.env.example` to create your own `.env` for production.
