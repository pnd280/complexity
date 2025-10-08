import { NetworkInterceptMiddlewareManagerService } from "@/plugins/__core__/_main-world/network-intercept/_service/service-init.loader";
import { errorWrapper } from "@/utils/wrappers/error-wrapper";

export function initFetchInterceptor() {
  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    if (init?.body == null || typeof init.body !== "string") {
      return originalFetch.call(window, input, init);
    }

    const [modifiedBody, error] = await errorWrapper(() =>
      interceptRequest(input, init.body as string),
    )();

    if (error) {
      return originalFetch.call(window, input, init);
    }

    if (modifiedBody === "") {
      return new Response("", { status: 200 });
    }

    init.body = modifiedBody;

    const response = await originalFetch.call(window, input, init);
    const url = constructUrl(input);

    if (response.headers.get("content-type")?.includes("text/event-stream")) {
      return handleStreamingResponse(response, url);
    }

    return handleRegularResponse(response, url);
  };
}

async function interceptRequest(input: RequestInfo | URL, body: string) {
  const resp =
    await NetworkInterceptMiddlewareManagerService.Proxy.executeMiddlewares({
      data: {
        type: "networkIntercept:fetchEvent",
        event: "request",
        payload: { url: constructUrl(input), data: body },
      },
    });

  return resp.payload.data;
}

function parseSSEChunk(chunk: string): { event: string; data: string }[] {
  const events: { event: string; data: string }[] = [];
  const eventStrings = chunk.split("\n\n").filter(Boolean);

  for (const eventString of eventStrings) {
    const lines = eventString.split("\n");
    let event = "message";
    let data = "";

    for (const line of lines) {
      if (line.startsWith("event:")) {
        event = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        data = line.slice(5).trim();
      }
    }

    if (data) {
      events.push({ event, data });
    }
  }

  return events;
}

function handleStreamingResponse(response: Response, url: string) {
  const reader = response.body?.getReader();
  if (!reader) return response;

  const decoder = new TextDecoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          let result = await reader.read();
          while (!result.done) {
            const chunk = decoder.decode(result.value, { stream: true });
            const events = parseSSEChunk(chunk);

            for (const event of events) {
              await log(url, response.status, event.data);
            }

            controller.enqueue(result.value);
            result = await reader.read();
          }
          controller.close();
        } catch (error) {
          controller.error(error);
          void reader.cancel();
        }
      },
    }),
    {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
    },
  );
}

async function handleRegularResponse(response: Response, url: string) {
  const clonedResponse = response.clone();
  const body = await clonedResponse.text();
  await log(url, response.status, body);
  return response;
}

async function log(url: string, status: number, data: string) {
  void NetworkInterceptMiddlewareManagerService.Proxy.noop({
    data: {
      type: "networkIntercept:fetchEvent",
      event: "response",
      payload: { url, status, data },
    },
  });
}

function constructUrl(url: unknown) {
  if (url instanceof URL) return url.href;
  if (typeof url === "string") return url;
  return "";
}
