# countries

NOTE: npm module corsproxy is included as a dependency because the geonames API
does not support CORS or JSONP requests. In order to run this project, type
`npm run proxy`, then open another shell and run `npm run start`. The app will
be viewable from `localhost:8080`, but API requests will bounce through
`localhost:1337`.
