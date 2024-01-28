# webhook-sample

Run with:

```sh
$ yarn dev
```

Trigger webhook:

```sh
$ curl -X POST -H "Content-Type: application/json" -d '{"device":{"id":"<DEVICE_ID>","lock":true}}' http://localhost:<PORT>/v1/webhook
```
