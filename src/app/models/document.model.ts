export class Documento {
    constructor(
            public id: string,
            public nombre: string,
            public rut: string,
            public email: string,
            public fecha:string,
            public estado:string,
            public file_name: string,
            public base64: string,
            public v?: string
    ){}
}