Object.defineProperty(WebSocket.prototype, "onerror", {
  set: function (handler) {
    if (typeof handler === "function") {
      WebSocket.prototype.addEventListener.call(this, "error", function () {
        document.body.setAttribute("ws-err", "true");
        // @ts-ignore
        handler.apply(this, arguments);
      });
    }
  },
});
