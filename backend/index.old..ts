import { Elysia, t } from "elysia";

export const app = new Elysia();

app.get("/", (context) => {
  return new Response(Bun.file("./index.html"));
});

app
  .state({
    redis: [] as Array<{ [id: string]: string }>,
  })
  .get(
    "/sort-it",
    (context) => {
      context.set.status = "OK";
      context.set.headers = {
        "Content-type": "text/html",
      };
      let store = context.store.redis;
      let isExist = store.find((e) => e.id == context.query.id);
      if (isExist) {
        return new Response(
          `
          <html lang="en">
          <head>
              <title>Hello World</title>
          </head>
          <body>
              <h1 safe>${isExist.id}</h1>
          </body>
      </html>
          `
        );
      } else {
        context.store.redis.push({ id: context.query.id });
        return new Response(`
        <html lang="en">
        <head>
            <title>Hello World</title>
        </head>
        <body>
            <h1 safe>${context.query.id}</h1>
        </body>
    </html>
        `);
      }
    },
    {
      query: t.Object({
        id: t.String(),
      }),
    }
  )
  .get("/getsort", (ctx) => {
    return ctx.store.redis;
  });

app.listen({ port: 8080, hostname: "0.0.0.0" }, ({ hostname, port }) => {
  console.log(`Running at http://${hostname}:${port}`);
});
