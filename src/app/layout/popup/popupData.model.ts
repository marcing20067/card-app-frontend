export interface PopupData {
    isShow: boolean;
    content?: {
        heading: string,
        text?: string
    },
    buttons?: {
        one?: string,
        two?: string
    } 
}