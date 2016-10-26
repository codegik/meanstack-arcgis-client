import { Injectable } from "@angular/core";
import * as io        from "socket.io-client";

declare var process;


@Injectable()
export class SocketService {
    private socket: SocketIOClient.Socket;
    private protocol: string;
    private host: string;
    private port: string;
    private namespace: string;

    constructor() {
      this.protocol = process.env.TARGET_SERVER_PROTOCOL;
      this.host = process.env.NODE_ENV;
      this.port = process.env.TARGET_SERVER_PORT;
      this.namespace = process.env.TARGET_SERVER_NAMESPACE;
    }

    open(): SocketIOClient.Socket {
        console.log("SOCKET");
        console.log(this.socket);
        if (!this.socket || !this.socket.connected) {
            let socketUrl = this.protocol + "//" + this.host + ":" + this.port + this.namespace;
            this.socket = io.connect(socketUrl);
            this.socket.on("connect", () => this.connect());
            this.socket.on("disconnect", () => this.disconnect());
            this.socket.on("error", (error: string) => {
                console.log(`ERROR: "${error}" (${socketUrl})`);
            });
        }
      
        return this.socket;
    }

    // Handle connection opening
    private connect() {
        console.log(`Connected to "${this.host}"`);
    }

    // Handle connection closing
    private disconnect() {
        console.log(`Disconnected from "${this.host}"`);
    }
}
