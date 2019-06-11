import { constants } from "../constants";
import { Dictionary } from "../Utils/Dictionary";

export class DataManager {

    private static instance: DataManager = null;
    public mapValues: Array<Dictionary<string>>;
    public values :Array<Array<any>>= null;
    protected keys: string[];
    /**
     * static getInstance
)    */
    public static getInstance(): DataManager {
        if (this.instance == null) {
            this.instance = new DataManager();
        }
        return this.instance;
    }

    /**
     * load
     */
    public load(fileName: string) {
        cc.loader.loadRes(constants.DATA_DIR + fileName, (error, stringFile) => {
            if (error) {
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
        let arrMatches = null;
        if (this.keys.length > 0) {
            this.mapValues = [];
            this.mapValues[0] = new Dictionary<string>();
            let index: number = 0;
            while (arrMatches = objPattern.exec(strData)) {
                let strMatchedDelimiter = arrMatches[1];
                if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                    this.mapValues[this.mapValues.length] = new Dictionary<string>();
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

                this.mapValues[this.mapValues.length - 1].add(this.keys[index] || ("temp" + index), strMatchedValue);
                index += 1;
            }
            if (this.mapValues.length > 0) {
                this.mapValues.pop();
            }
        }
        this.values = [[]];
        while (arrMatches = objPattern.exec(strData)) {
            let strMatchedDelimiter = arrMatches[1];
            if (
                strMatchedDelimiter.length &&
                (strMatchedDelimiter != strDelimiter)
            ) {
                this.values.push([]);
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
            this.values[this.values.length - 1].push(strMatchedValue);
        }
        if (this.values.length > 0) {
            this.values.pop();
        }
    }

}
