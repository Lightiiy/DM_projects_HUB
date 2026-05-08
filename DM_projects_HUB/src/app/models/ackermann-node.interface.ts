export interface AckermannNode {
    m: number;
    n: number;
    result?: number;
    children: AckermannNode[];
}

export interface AckermannFrame {
    m: number;
    n: number;
}