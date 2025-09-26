// SPDX-License-Identifier: ISC
/*
 * Copyright (c) 2021-2025 Yahweasel
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
 * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
 * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

export type EventHandler = (ev: any) => void;

/**
 * General-purpose event emitter.
 */
export class EventEmitter {
  constructor() {
    this._handlers = Object.create(null);
    this._onceHandlers = Object.create(null);
  }

  /**
   * Set an event handler.
   * @param ev  Event name, or "*" for all events.
   * @param handler  Event handler for this event.
   */
  on(ev: string, handler: EventHandler) {
    if (!(ev in this._handlers)) this._handlers[ev] = [];
    this._handlers[ev].push(handler);
  }

  /**
   * Set a one-time event handler.
   * @param ev  Event name, or "*" for all events.
   * @param handler  Event handler for this event.
   */
  once(ev: string, handler: EventHandler) {
    if (!(ev in this._onceHandlers)) this._onceHandlers[ev] = [];
    this._onceHandlers[ev].push(handler);
  }

  /**
   * Remove an event handler.
   * @param ev  Event name.
   * @param handler  Handler to remove.
   */
  off(ev: string, handler: EventHandler) {
    for (const handlers of [this._handlers[ev], this._onceHandlers[ev]]) {
      if (!handlers) continue;
      const idx = handlers.indexOf(handler);
      if (idx >= 0) handlers.splice(idx, 1);
    }
  }

  /**
   * Emit this event.
   * @param ev  Event name to emit.
   * @param arg  Argument to the event handler(s).
   */
  emitEvent(ev: string, arg: any) {
    for (const handlers of [this._handlers[ev], this._onceHandlers[ev]]) {
      if (!handlers) continue;
      for (const handler of handlers) handler(arg);
    }
    delete this._onceHandlers[ev];

    const handlers = this._handlers["*"];
    if (handlers) {
      for (const handler of handlers) handler({ event: ev, arg });
    }
  }

  /**
   * All event handlers.
   */
  private _handlers: Record<string, EventHandler[]>;

  /**
   * One-time event handlers.
   */
  private _onceHandlers: Record<string, EventHandler[]>;
}
