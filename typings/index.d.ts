interface QuickDB {
    target?: string | null;
    table?: string;
}

interface MongoOptions {
    url?: string | null;
    schema?: string | null;
}

declare const LweaxoDB: {
    version: string;
    size: string;
    setLanguage:(language:"tr"|"en") => true;
    setCheckUpdates:(boolean:boolean) => boolean;
    setReadable:(readable:boolean) => boolean;
    setNoBlankData:(noBlankData:boolean) => boolean;
    setAdapter:(adapter:"jsondb"|"localstorage"|"mongo"|"yamldb", MongoOptions?: MongoOptions) => true;
    setWebPanel:(setting:boolean, port?:number) => true;
    setFolder:(name:string) => true;
    setFile:(name:string) => true;
    setSeperator:(seperator:string) => true;

    set: (key: string, value: any) => any;
    delete: (key: string) => boolean;
    fetch: (key: string) => any;
    has: (key: string) => boolean;
    get: (key: string) => any;
    push: (key: string, value: any) => any[];
    unpush: (key: string, value: any) => any[];
    add: (key: string, value: number) => number;
    subtract: (key: string, value: number) => number;
    setByPriority: (key: string, value: any) => any;
    delByPriority: (key: string, value: any) => any;
    all: () => { [key: string]: any };
    deleteAll: () => boolean;
    move: (QuickDB: QuickDB) => boolean;
    moveToMongo: (JsonDB: Object) => boolean;

}

export = LweaxoDB;