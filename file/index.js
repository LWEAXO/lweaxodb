const fs = require('fs');
const path = require('path');

const langs = ["tr", "en"];

// Sürüm bilgisi alma fonksiyonu
function getVersion() {
  try {
    const packageJsonPath = path.resolve(__dirname, '../package.json');
    const packageJson = require(packageJsonPath);
    return packageJson.version;
  } catch (error) {
    console.error(`Error reading version: ${error.message}`);
    return undefined;
  }
}

// Boyut bilgisi alma fonksiyonu
function getSize() {
  try {
    const filePath = path.resolve(__dirname, '../../../lweaxodb/lweaxodb.json');
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;

    if (fileSize < 1024) {
      return `${fileSize} Bytes`;
    } else if (fileSize < 1024 * 1024) {
      return `${(fileSize / 1024).toFixed(2)} KB`;
    } else if (fileSize < 1024 * 1024 * 1024) {
      return `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(fileSize / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  } catch (error) {
    console.error(`Error getting file size: ${error.message}`);
    return undefined;
  }
}

module.exports = {
  get version() {
    return getVersion();
  },

  get size() {
    return getSize();
  },

  setOptions() {
    var adapter = this.adapter || require("../adapters/jsondb");
    if(this.mongoOptions?.schema) {
      this.isMongoSpecialSchema = true;
    } else {
      this.isMongoSpecialSchema = false;
    }
    this.options = {
      dbName: this.file || "lweaxodb",
//      webPanel: {
//        isActive: this.webPanel,
//        port: this.webPort
//      },
      dbFolder: this.folder || "lweaxodb",
      noBlankData: this.noBlankData || false,
      readable: this.readable || false,
      language: this.lang ? this.lang : "tr",
      isMongo: this.mongo,
      mongoOptions: this.mongoOptions || {seperator: this.seperator || "."},
      isMongoSpecialSchema: this.isMongoSpecialSchema,
      checkUpdates: this.checkUpdates || true,
      seperator: this.seperator || "."
    }
    this.message = this.lang ? require(`../language/${this.lang.toLowerCase()}.json`) : require(`../language/tr.json`);
    this.options.mongoOptions.seperator = this.options.seperator
    this.adapter = adapter.set ? adapter : (this.mongo ? new adapter(this.options.mongoOptions) : new adapter(this.options));
//    if(this.webPanel) {
//      var pnl = require("./webPanel");
//      this.panel = new pnl(this.options.webPanel.port, this.adapter)
//    }
    if(this.checkUpdates) {
      try {
        fetch("https://registry.npmjs.org/lweaxodb/latest").then(async(res) => {
            res.json().then((data) => {
              if(require("../package.json").version !== data.version) {
                console.warn(this.message["errors"]["oldVersion"])
              }
            })
        })
      } catch (err) {
        
      }
    }
  },

  setCheckUpdates(a) {
    if(a === true) {
      this.checkUpdates = true;
      this.setOptions();
      return a;
    } else {
      this.checkUpdates = false;
      this.setOptions();
      return false;
    }
  },

//  setWebPanel(a, port = 2229) {
//    if(a === true) {
//      this.webPanel = true;
//      this.webPort = port;
//      this.setOptions();
//      return a;
//    } else {
//      this.webPanel = false;
//      this.webPort = port;
//      this.setOptions();
//      return false;
//    }
//  },

  setSeperator(a) {
    this.seperator = a;
    this.options.seperator = a;
    this.options.mongoOptions.seperator = a;
    this.setOptions();
    return true
  },

  setLanguage(lang) {
    this.lang = lang ? (langs.includes(lang.toLowerCase()) ? lang.toLowerCase() : "en") : "en";
    this.message = require(`../language/${this.lang.toLowerCase()}.json`);
    this.setOptions();
    return lang;
  },

  deleteMongo() {
    var adapter = require("../adapters/jsondb");
    this.adapter = adapter;
    this.mongo = false;
    this.setOptions();
  },

  setAdapter(adapter, options = {seperator: this.options.seperator}) {
    if(adapter !== "mongo") {
      var adapter = require("../adapters/"+adapter) || require("../adapters/jsondb");
      this.adapter = adapter;
      this.mongo = false;
      this.setOptions();
      return true;
    } else {
      try {
        require("mongoose");
      } catch (error) {
        throw new TypeError("You must install \"mongoose\" modules to use this adapter.");
      }
      var adapter = require("../adapters/mongo/index");
      this.mongo = true;
      this.adapter = adapter;
      this.mongoOptions = options;
      this.setOptions();
      return adapter;
    }
  },

  setFolder(folder) {
    this.folder = folder;
    this.setOptions();
    return true;
  },

  setFile(file) {
    this.file = file;
    this.setOptions();
    return true;
  },

  setReadable(boolean) {
    this.readable = boolean ? (typeof boolean === "boolean" ? true : false) : false;
    this.setOptions();
    return this.readable;
  },

  setNoBlankData(boolean) {
    this.noBlankData = boolean ? (typeof boolean === "boolean" ? boolean : false) : false;
    this.setOptions();
    return this.noBlankData;
  },
  
  set(db, data) {
    this.setOptions();
  	if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!data) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

  	return this.adapter.set(db, data);
  },

  get(db) {
    this.setOptions();
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    try {
      return this.adapter.get(db);
    } catch(err) {
      return undefined;
    }

  },

  fetch(db) {
    this.setOptions();
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    try {
      return this.adapter.get(db);
    } catch(err) {
      return undefined;
    }

  },

  has(db) {
    this.setOptions();
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    try {
      return this.adapter.has(db);
    } catch(err) {
      return false;
    }

  },

  delete(db) {
    this.setOptions();
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    try {
      return this.adapter.delete(db);
    } catch (err) {
      return false;
    }

  },

  add(db, number) {
    this.setOptions();
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!number) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(isNaN(number)) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    return this.adapter.add(db, number);

  },

  subtract(db, number) {
    this.setOptions();
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!number) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(isNaN(number)) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    return this.adapter.subtract(db, number);

  },

  push(db, data) {
    this.setOptions();
  	if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!data) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

  	return this.adapter.push(db, data);
  },

  unpush(db, data) {
    this.setOptions();
  	if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!data) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

  	return this.adapter.unpush(db, data);
  },

  delByPriority(db, number) {
    this.setOptions();
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!number) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(isNaN(number)) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    return this.adapter.delByPriority(db, number);

  },

  setByPriority(db, data, number) {
    this.setOptions();
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!data) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(!number) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    return this.adapter.setByPriority(db, data, number);

  },

  all() {
    this.setOptions();
    try {
      return this.adapter.all();
    } catch (err) {
      return undefined;
    }

  },

  deleteAll() {
    this.setOptions();
    try {
      return this.adapter.deleteAll();
    } catch (err) {
      return false;
    }

  },

  move(quickDB) {
    this.setOptions();
    if(!quickDB) throw new TypeError(this.message["errors"]["quickdbUndefined"]);

    if(!quickDB.all()) throw new TypeError(this.message["errors"]["quickdbEmpty"]);

    if(this.mongo) throw new TypeError(this.message["errors"]["quickdbToMongo"]);

    try {
      var datas = quickDB.all();
      for (let i = 0; i < datas.length; i++) {
        this.set(datas[i].ID, datas[i].data);
      }

      return true;
    } catch (err) {
      throw new TypeError(this.message["errors"]["quickdbToLweaxodb"]);
    }
  },

  moveToMongo(JsonDB) {
    this.setOptions();
    if(!JsonDB) throw new TypeError(this.message["errors"]["quickdbUndefined"]);

    if(!JsonDB.all()) throw new TypeError(this.message["errors"]["quickdbEmpty"]);

    if(this.mongo) throw new TypeError(this.message["errors"]["quickdbToMongo"]);

    try {
      var datas = JsonDB.all();
      for (let i = 0; i < datas.length; i++) {
        this.set(datas[i].ID, datas[i].data);
      }

      return true;
    } catch (err) {
      throw new TypeError(this.message["errors"]["quickdbToLweaxodb"]);
    }
  }
};
