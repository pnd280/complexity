import { NetworkInterceptMiddlewareManagerService } from "@/plugins/__core__/_main-world/network-intercept/_service/service-init.loader";

export function initFetchInterceptor() {
  const originalFetch = window.fetch;

  window.fetch = async function (
    request: RequestInfo | URL,
    init?: RequestInit,
  ) {
    if (init?.body != null && typeof init.body === "string") {
      const [modifiedBody, error] = await tryCatch(() =>
        NetworkInterceptMiddlewareManagerService.Proxy.executeMiddlewares({
          data: {
            type: "networkIntercept:fetchEvent",
            event: "request",
            payload: {
              url: constructUrl(request),
              data: init.body?.toString() ?? "",
            },
          },
        }),
      );

      if (error) {
        return originalFetch.call(window, request, init);
      }

      if (modifiedBody != null && modifiedBody.payload.data === "") {
        return new Response("", { status: 200 });
      }

      init.body = modifiedBody?.payload.data ?? "";
    }

    const response = await originalFetch.call(window, request, init);

    if (response.headers.get("content-type")?.includes("text/event-stream")) {
      return handleStreamingResponse(response);
    }

    return handleRegularResponse(response);
  };
}

function parseSSEChunk(chunk: string): { event: string; data: string }[] {
  const events: { event: string; data: string }[] = [];
  const eventStrings = chunk
    .replace(/\r\n|\r/g, "\n")
    .split("\n\n")
    .filter(Boolean);

  for (const eventString of eventStrings) {
    const lines = eventString.split("\n");
    let event = "";
    let data = "";

    for (const line of lines) {
      const sanitizedLine = line.trim();
      if (sanitizedLine.startsWith("event:")) {
        event = sanitizedLine.slice(6).trim();
      } else if (sanitizedLine.startsWith("data:")) {
        data = sanitizedLine.slice(5).trim();
      }
    }

    if (data) {
      events.push({ event, data });
    }
  }

  return events;
}

function handleStreamingResponse(response: Response) {
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
              void NetworkInterceptMiddlewareManagerService.Proxy.executeMiddlewares(
                {
                  data: {
                    type: "networkIntercept:fetchEvent",
                    event: "response",
                    payload: {
                      url: constructUrl(response.url),
                      status: response.status,
                      data: event.data,
                    },
                  },
                },
              );
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

async function handleRegularResponse(response: Response) {
  const clonedResponse = response.clone();
  const body = await clonedResponse.text();
  void NetworkInterceptMiddlewareManagerService.Proxy.noop({
    data: {
      type: "networkIntercept:fetchEvent",
      event: "response",
      payload: {
        url: constructUrl(response.url),
        status: response.status,
        data: body,
      },
    },
  });
  return response;
}

function constructUrl(url: unknown) {
  if (url instanceof URL) return url.href;
  if (typeof url === "string") return new URL(url, window.location.origin).href;
  return "";
}
