import { Injectable } from "@angular/core";
import * as io        from "socket.io-client";

declare var process;


@Injectable()
export class SocketService {
    private socket: SocketIOClient.Socket;
    private protocol = process.env.TARGET_SERVER_PROTOCOL || window.location.protocol;
    private host = process.env.TARGET_SERVER_HOST || window.location.hostname;
    private port = process.env.TARGET_SERVER_PORT || 5000;
    private namespace = process.env.TARGET_SERVER_NAMESPACE || '/map';

    constructor() {}

    open(): SocketIOClient.Socket {
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
