import { constants } from "../constants";
import { Dictionary } from "../Utils/Dictionary";

export class DataManager {

    private static instance:DataManager = null;
    public values :Array<Dictionary<string>>;
    protected keys: string[];
    /**
     * static getInstance
)    */
    public static getInstance():DataManager {
        if (this.instance == null){
            this.instance = new DataManager();
        }
        return this.instance;
    }

    /**
     * load
     */
    public load(fileName:string) {
        cc.loader.loadRes(constants.DATA_DIR + fileName, (error,stringFile)=>{
            if (error){
                cc.log("[DataManager]fileName is read error!");
                return;
            }
            // cc.log("[DataManager]" + stringFile.toString());
            this.parseCSV(stringFile.toString());
        });
    }

    public parseCSV(strData, strDelimiter = ",") {
        strDelimiter = (strDelimiter || ",");
        let objPattern = new RegExp(
            (
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );
        this.values = [];
        this.values[0] = new Dictionary<string>();
        let arrMatches = null;
        let index: number = 0;
        while (arrMatches = objPattern.exec(strData)) {
            let strMatchedDelimiter = arrMatches[1];
            if (strMatchedDelimiter.length &&(strMatchedDelimiter != strDelimiter)) {
                this.values[this.values.length] = new Dictionary<string>();
                index = 0;
            }
            let strMatchedValue = "";
            if (arrMatches[2]) {
                strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"),
                    "\""
                );
            } else {
                strMatchedValue = arrMatches[3];
            }
            
            this.values[this.values.length - 1].add(this.keys[index] || ("temp" + index), strMatchedValue);
            index += 1;
        }
        if (this.values.length > 0) {
            this.values.pop();
        }
        // cc.log("[DataManager]CSVToArray" + this.values.toString());
    }

}
