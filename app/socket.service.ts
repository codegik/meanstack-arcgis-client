import { Injectable } from "@angular/core";
import * as io        from "socket.io-client";

declare var process;


@Injectable()
export class SocketService {
    private socket: SocketIOClient.Socket;
    private protocol = 'https';
    private host = 'arcane-mountain-81855.herokuapp.com';
    private port = '80';
    private namespace = '/map';

    constructor() {}

    open(): SocketIOClient.Socket {
        if (!this.socket || !this.socket.connected) {
            let socketUrl = this.protocol + "://" + this.host + ":" + this.port + this.namespace;
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
