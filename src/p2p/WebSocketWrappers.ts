import WebSocket, { Server as WsServer, ServerOptions } from 'ws';
import { Server as HttpsServer } from 'https';

export interface WebSocketWrapper {
	on: (event: string, fn: (message?: string) => void) => void;
	send: (data: string) => void;
}

export interface WebSocketHttpsServerWrapper {
	listen: (port: number) => void;
}

export interface WebSocketServerWrapper {
	on: (event: string, fn: (socket: WebSocketWrapper) => void) => void;
}

export class WebSocketWrapperImpl implements WebSocketWrapper {
	#webSocket: WebSocket;
	constructor(webSocket: WebSocket) {
		this.#webSocket = webSocket;
	}

	on(event: string, fn: (message?: string) => void) {
		this.#webSocket.on(event, fn);
	}
}

export class WebSocketHttpsServerWrapperImpl
	implements WebSocketHttpsServerWrapper
{
	#httpsServer: HttpsServer;
	constructor(httpsServer: HttpsServer) {
		this.#httpsServer = httpsServer;
	}
	listen(port: number) {
		this.#httpsServer.listen(port);
	}
}

export class WebSocketServerWrapperImpl implements WebSocketServerWrapper {
	#server: WsServer;
	constructor(options?: ServerOptions) {
		this.#server = new WsServer(options);
	}
	on(event: string, fn: (socket: WebSocketWrapper) => void) {
		this.#server.on(event, (ws: WebSocket) =>
			fn(new WebSocketWrapperImpl(ws))
		);
	}
}
