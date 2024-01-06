import { rateLimit } from "elysia-rate-limit";

export default rateLimit({
  skip: (request) =>
    request.headers.get("host")?.includes("localhost") ?? false,
});
