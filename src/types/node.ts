export interface node {
    id: number;
    name: string;
    parent: node | null;
    children: node[];
}
