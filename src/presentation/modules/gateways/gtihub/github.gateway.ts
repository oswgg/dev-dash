import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GithubNotificationsService } from "../../../../domain/services";
import { PullRequestEntity, UserEntity } from "../../../../domain/entities";
import { AuthGatewayMiddleware } from "../../../middlewares/auth-gateway.middleware";

@WebSocketGateway({ namespace: 'github', cors: { origin: '*' } })
export class GithubGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, GithubNotificationsService {
    private readonly logger = new Logger(GithubGateway.name);

    @WebSocketServer() io!: Server;

    afterInit() {
        this.logger.log('Initialized');
        this.io.use(AuthGatewayMiddleware.use);
    }

    handleConnection(client: Socket, ...args: any[]) {
        if (!client.user) {
            client.disconnect();
            return;
        }

        client.join(client.user.id);
    }

    handleDisconnect(client: Socket) {
    }

    sendNewPullRequest(clientId: UserEntity['id'], pullRequest: PullRequestEntity): void {
        this.io.to(clientId).emit('new-pull-request', pullRequest);
    }

    sendUpdatedPullRequest(clientId: UserEntity['id'], pullRequest: PullRequestEntity): void {
        this.io.to(clientId).emit('updated-pull-request', pullRequest);
    }

    sendPullRequestMerged(clientId: UserEntity['id'], pullRequest: PullRequestEntity): void {
        this.io.to(clientId).emit('merged-pull-request', pullRequest);
    }
}