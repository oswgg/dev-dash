export type QueryOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'between' | 'like' | 'contains';

export type QueryFilter<T> = {
    [K in keyof T]: {
        operator: QueryOperator;
        value: any;
    } | T[K];
}

export const isQueryFilter = (input: any): boolean => {
    return Array.isArray(input) &&
        input.every( f =>
            f.field &&
            f.operator &&
            f.value
        );
}


export type QueryUpdate<T> = {
    where:  QueryFilter<Partial<T>>;
    updated: Partial<T>;
}