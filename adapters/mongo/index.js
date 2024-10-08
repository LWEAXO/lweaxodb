"use strict";
const Base = require("./Base");
const Schema = require("./Schema");
const functions = require("../../functions/mongo")
const _ = require("lodash");

class MongoDB extends Base {
	constructor(options) {
        super(options["url"])
        this.schema = options.schema ? Schema(options.schema) : Schema("JSON")
        this.seperator = options["seperator"]
	}

  async set(db, data) {

        if(!db) {
            throw new TypeError(this.message["errors"]["blankName"]);
        }

        if(!data) {
            throw new TypeError(this.message["errors"]["blankData"]);
        }
        
          if(db.includes(this.seperator)) {
            var content = await this.schema.findOne({
              key: db.split(this.seperator).shift()
            });

            if (!content) {
              var content = {};
              functions.set(db.split(this.seperator).slice(1).join(this.seperator), data, content, this.seperator);
              await this.schema.findOneAndUpdate({key: db.split(this.seperator).shift()}, { value: content}, {upsert: true});

              return data;

            } else {
              const prev = Object.assign({}, content.value);
              functions.set(db.split(this.seperator).slice(1).join(this.seperator), data, prev, this.seperator);
              await this.schema.findOneAndUpdate({key: db.split(this.seperator).shift()}, {value: prev}, {upsert: true});
              return data;
            }
          } else {
            await this.schema.findOneAndUpdate({key: db}, {value: data}, {upsert: true});
            return data;
          }
  }

  async get(db) {

    if(!db) {
        throw new TypeError(this.message["errors"]["blankName"]);
    }
    
      if(db.includes(this.seperator)) {
        let content = await this.schema.findOne({
          key: db.split(this.seperator).shift()
        });
        if(!content) return undefined
        return _.get(content.value, db.split(this.seperator).slice(1).join(this.seperator));
      } else {
        let content = await this.schema.findOne({
          key: db
        });
        if(!content) return undefined
        return content.value;
      }
}

  async fetch(db) {

    return await this.get(db);

  }

  async has(db) {

    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    return ((await this.get(db)) ? true : false)

  }

  async delete(db) {
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }
  
      if(db.includes(this.seperator)) {
        let content = await this.get(db.split(this.seperator).shift());
        if(!content) return true;
        const newContent = Object.assign({}, content);
        functions.remove(newContent, db.split(this.seperator).slice(1).join(this.seperator), this.seperator);
        this.set(db.split(this.seperator).shift(), newContent)
        setTimeout(async() => {
        var newData = await this.get(db.split(this.seperator).slice(0, db.split(this.seperator).length - 1).join(this.seperator))
          if(typeof newData === "object") {
            if(Object.keys(newData).length === 0) {
              await this.delete(db.split(this.seperator).slice(0, db.split(this.seperator).length - 1).join(this.seperator))
            }
          }
        }, 500)
      } else {
        await this.schema.findOneAndDelete({
            key: db
        });
      }
      return true;

  }

  async add(db, number) {
    
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!number) {
        throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    if(isNaN(number)) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

      let content = await this.get(db);

      if (!content) {
          await this.set(db, number)
          return number;

      } else {
          await this.set(db, content + number)
          
          return content + number;
      }

  }

  async subtract(db, number) {
    
    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!number) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(isNaN(number)) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    const content = await this.get(db);

    let newNumber = content - number;
    
    if(!isNaN(content)) {
      if(newNumber <= 0) {
        await this.delete(db);
        return 0;
      } else {
        return await this.set(db, newNumber)
      }
    } else {
      return 0;
    }

  }

  async push(db, data) {

    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!data) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    var arr = [];

    if(await this.get(db)) {
      if(typeof (await this.get(db)) !== "object") {
        arr = [];
      } else {
        arr = await this.get(db);
      }
    }

    arr.push(data);

    await this.set(db, arr);

    return await this.get(db);

  }

  async unpush(db, data) {

    if(!db) {
      throw new TypeError(this.message["errors"]["blankName"]);
    }

    if(!data) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    var arr = [];

    if(this.get(db)) {
      arr = await this.get(db);
    }

    arr = arr.filter((x) => x !== data);

    await this.set(db, arr);

    return await this.get(db);

  }

  async delByPriority(db, number) {

    if(!db) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(!number) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    if(isNaN(number)) {
      throw new TypeError();
    }

    if(!(await this.get(db)) || (await this.get(db)).length < 1) {
      return false;
    }

    let content = await this.get(db);
    let neww = [];

    if (typeof content !== "object") {
      return false;
    }

    for (let a = 0; a < content.length; a++) {
      if (a !== (number-1)) {
        neww.push(content[`${a}`]);
      }
    }

    await this.set(db, neww);
    return await this.get(db);

  }

  async setByPriority(db, data, number) {

    if(!db) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(!data) {
      throw new TypeError(this.message["errors"]["blankData"]);
    }

    if(!number) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    if(isNaN(number)) {
      throw new TypeError(this.message["errors"]["blankNumber"]);
    }

    if(!(await this.get(db)) || (await this.get(db)).length < 1) {
      return false;
    }

    let content = await this.get(db);
    let neww = [];

    if (typeof content !== "object") {
      return false;
    }

    for (let a = 0; a < content.length; a++) {
      let val = content[`${a}`];

      if(a === (number-1)) {
        neww.push(data);
      } else {
        neww.push(val);
      }
    }

    await this.set(db, neww);
    return await this.get(db);

  }

  async all() {
      let content = await this.schema.find({});

      return content;

  }

  async deleteAll() {

      await this.schema.deleteMany();

      return true;


  }

}

module.exports = MongoDB;