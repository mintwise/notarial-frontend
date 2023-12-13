export interface UploadForm {
    name?: string;
    rut?: string;
    date: string;
    email: string;
    state: string;
    filenameDocument?: string;
    typeDocument?: string;
    base64Document: string;
}