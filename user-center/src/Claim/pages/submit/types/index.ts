// 对话接口
export interface MaterialItem {
    example?: Array<string>;
    explanation: string;
    materialId: string;
    materialIds: Array<string>;
    materialName: string;
    required: boolean;
}
// 对话接口
export interface MaterialReql {
    files: Array<string>;
    materialId: string;
}
