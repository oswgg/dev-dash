type QueryOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'between' | 'like' | 'contains';

export type QueryFilter<T> = {
    field: keyof T;
    operator: QueryOperator;
    value: any;
}

export const isQueryFilter = (input: any): boolean => {
    return Array.isArray(input) &&
        input.every( f =>
            f.field &&
            f.operator &&
            f.value
        );
}