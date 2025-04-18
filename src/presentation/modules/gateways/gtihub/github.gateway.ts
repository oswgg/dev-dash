import { Logger } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GithubNotificationsService } from "../../../../domain/services";
import { PullRequestEntity } from "../../../../domain/entities";

@WebSocketGateway({ namespace: 'github', cors: { origin: '*' } })
export class GithubGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, GithubNotificationsService {
    private readonly logger = new Logger(GithubGateway.name);
    
    @WebSocketServer() io!: Server;
    
    afterInit() {
        this.logger.log('Initialized');
    }
    
    handleConnection(client: Socket, ...args: any[]) {
    }
    
    handleDisconnect(client: Socket) {
    }
    
    sendNewPullRequest(pullRequest: PullRequestEntity): void {
        console.log('enviando')
        this.io.emit('new-pull-request', pullRequest);
    }
    
    sendUpdatedPullRequest(pullRequest: PullRequestEntity): void {
        this.io.emit('updated-pull-request', pullRequest);
    }
}