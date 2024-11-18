

export interface IJsonTelementry {
    ts?: number; // timestamp in millisec
    label: string;
    values : number[]
}

export function isJsonTelementry(target: any): target is IJsonTelementry {

    target = (target as IJsonTelementry)

    return (
        target.label !== undefined 
        && target.values !== undefined
    );
  }

export type JsonTelementryArray = IJsonTelementry[]; 

export function isJsonTelementryArray(target: any): target is JsonTelementryArray {
    if (! Array.isArray(target) ) return false;
    target = target as JsonTelementryArray;

    let check: boolean = true;

    target.every((val: any) => {
        if (isJsonTelementry(val)) {
            check = false;
            return false;
        
        }
        return true
    })


    return check;

}

