import {Resources, TextAsset } from "UnityEngine";

export default class JSONParser {
    public static ParseJSON<T>(fileName: string): T
    {
        let parsedData: T;
        let file: TextAsset = Resources.Load<TextAsset>(fileName);
        console.log(file.ToString());
        parsedData = JSON.parse(file.ToString(), this.reviver) as T;
        console.log(typeof(parsedData));
        return parsedData;         
    }

    public static replacer(key, value) {
        if(value instanceof Map) {
            return {
                dataType: 'Map',
                value: Array.from(value.entries()), // or with spread: value: [...value]
            };
        } else {
            return value;
        }
    }
    
    public static reviver(key, value) {
        if(typeof value === 'object' && value !== null) {
            if (value.dataType === 'Map') {
                return new Map(value.value);
            }
        }
        return value;
    }
}