import { nanoid } from "nanoid";
import type { Socket } from "socket.io-client";
import io from "socket.io-client";

export class InternalWebSocketManager {
  private static instance: InternalWebSocketManager;

  private sockets: Map<string, Socket>;

  private constructor() {
    this.sockets = new Map();
  }

  static getInstance(): InternalWebSocketManager {
    if (InternalWebSocketManager.instance == null) {
      InternalWebSocketManager.instance = new InternalWebSocketManager();
    }
    return InternalWebSocketManager.instance;
  }

  public async handShake(params?: {
    id?: string;
    upgrade?: boolean;
  }): Promise<Socket> {
    const { id = nanoid(), upgrade = true } = params ?? {};

    return new Promise((resolve, reject) => {
      const socket = io("", {
        transports: ["polling", "websocket"],
        upgrade,
        reconnection: false,
      });

      this.sockets.set(id, socket);

      socket.on("connect", () => {
        resolve(socket);
      });

      setTimeout(() => {
        if (!socket.connected) {
          socket.close();
          reject(new Error("Connection timeout"));
        }
      }, 10000);
    });
  }

  public getSocket(id?: string): Socket | null {
    this.removeClosedSockets();

    if (id == null) {
      if (this.sockets.size === 0) return null;

      return this.sockets.values().next().value ?? null;
    }

    return this.sockets.get(id) ?? null;
  }

  public removeSocket(id: string): boolean {
    this.sockets.get(id)?.close();

    return this.sockets.delete(id);
  }

  private async ensureConnectedSocket(id?: string): Promise<Socket> {
    let socket = this.getSocket(id);

    if (socket == null) {
      socket = await this.handShake({ id });
    }

    if (socket.io.engine.readyState === "opening") {
      await new Promise<void>((resolve) => socket.once("open", resolve));
    }

    return socket;
  }

  public async sendMessageWithAck<T = unknown>(params: {
    id?: string;
    data: [string, ...unknown[]];
  }): Promise<T> {
    const socket = await this.ensureConnectedSocket(params.id);
    return socket.emitWithAck(...params.data);
  }

  public async sendMessage(params: {
    id?: string;
    data: [string, ...unknown[]];
  }): Promise<void> {
    const socket = await this.ensureConnectedSocket(params.id);
    socket.emit(...params.data);
  }

  public async sendRawMessage(params: {
    id?: string;
    data: string;
  }): Promise<void> {
    const socket = await this.ensureConnectedSocket(params.id);
    socket.io.engine.send(params.data);
  }

  private removeClosedSockets() {
    Array.from(this.sockets.entries()).forEach(([id, socket]) => {
      if (socket.io.engine.readyState === "closed") {
        this.sockets.delete(id);
      }
    });
  }
}
