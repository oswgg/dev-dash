import { MondayTaskEntity } from "../../domain/entities";

type ApiCallItem = {
    id: string;
    name: string;
    column_values: { text: string }[];
}


type ApiCallBoard = {
    id: string;
    name: string;
    items_page: {
        items: ApiCallItem[];
    }
};


export class MondayTaskMapper {
    static fromApiCallToEntity(obj: any): MondayTaskEntity[] {

        const tasks = obj.boards.flatMap((board: ApiCallBoard) =>
            board.items_page.items.map((item: ApiCallItem) =>
                this.fromObjectToEntity({
                    board: board.name,
                    name: item.name,
                    status: item.column_values[0].text
                })
            )
        );

        return tasks;
    }

    static fromObjectToEntity(obj: any): MondayTaskEntity {
        return new MondayTaskEntity(
            obj.board,
            obj.name,
            obj.status
        );
    }

}