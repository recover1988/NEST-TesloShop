import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket, Server } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true, namespace: '/' })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService
  ) { }
  handleConnection(client: Socket) {
    this.messagesWsService.registerClient(client);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id)
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  // Escuchar los eventos que suceden en el cliente

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    // Emite unicamente al cliente, no a todos
    // client.emit('message-from-server', {
    //   fullName: 'soy yo',
    //   message: payload.message || 'no message'
    // })
    // Emitir a todos menos al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'soy yo',
    //   message: payload.message || 'no message'
    // })
// Emite a todos incluido al cliente   
    this.wss.emit('message-from-server', {
      fullName: 'soy yo',
      message: payload.message || 'no message'
    })
  }

}
