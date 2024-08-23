<div align="center">

# lweaxodb
![NPM Downloads by package author](https://img.shields.io/npm-stat/dw/LWEAXO?plastic&logo=npm&label=%C4%B0ndirme)
![NPM Downloads by package author](https://img.shields.io/npm-stat/dm/LWEAXO?plastic&logo=npm&label=%C4%B0ndirme)
![NPM Downloads by package author](https://img.shields.io/npm-stat/dy/LWEAXO?plastic&logo=npm&label=%C4%B0ndirme)
</div>

# What's new in 0.0.3?
- webpanel enabled
- mode: test & bog fixed


---

## Bir Sorunuz Olursa Veya Beni Desteklemek İçin [Discord](https://discord.gg/X7F9swzFR6) Sunucuma Katılın.

Examples

> (QuickDB) Moving Everything to lweaxodb

```js
const db = require("lweaxodb");
const quickdb = require("quick.db");

await db.move(quickdb)
```

> (JsonDB) Moving Everything to MongoDB

```js
const db = require("lweaxodb");
db.setAdapter("mongo", {url: "YOUR_MONGO_URL", Schema: "Schema Name"})
const JsonDB = require("../your_file.json");

db.moveToMongo(JsonDB)
//Github: LWEAXO
```

> Example

```js
const db = require("lweaxodb")

db.set("x.y.z", "abc") // abc

db.get("x") // {y: {z: "abc"}}
db.fetch("x") // {y: {z: "abc"}}
db.all() // {x: {y: {z: "abc"}}}

db.push("a", "hello") //  ["hello"]
db.push("a", "world") //  ["hello", "world"]
db.unpush("a", "hello") // ["world"]

db.push("b", {test: "lweaxodb"}) // [{test: "lweaxodb"}]
db.push("b", {test2: "lweaxodb2"}) // [{test: "lweaxodb"}, {test2: "lweaxodb2"}]
db.delByPriority("b", 1) // [{test2: "lweaxodb"}]
db.setByPriority("b", {newtest:"hey this is edited"}, 1) // [{newtest:"hey this is edited"}]

db.has("x") // true
db.delete("x") // true
db.deleteAll() // true
```

> MongoDB if you find any bugs join my [Discord](https://discord.gg/X7F9swzFR6))

```js
const db = require("lweaxodb")
db.setAdapter("mongo", 
{
    url: "Your Mongo URL", 
    schema: "Schema Name" // Not required. You can't define your own schema. Just name.
})

await db.set("x.y.z", "abc") // abc

await db.get("x") // {y: {z: "abc"}}
await db.fetch("x") // {y: {z: "abc"}}
await db.all() // {x: {y: {z: "abc"}}}

await db.push("a", "hello") //  ["hello"]
await db.push("a", "world") //  ["hello", "world"]
await db.unpush("a", "hello") // ["world"]

await db.push("b", {test: "lweaxodb"}) // [{test: "lweaxodb"}]
await db.push("b", {test2: "lweaxodb2"}) // [{test: "lweaxodb"}, {test2: "lweaxodb2"}]
await db.delByPriority("b", 1) // [{test2: "lweaxodb"}]
await db.setByPriority("b", {newtest:"hey this is edited"}, 1) // [{newtest:"hey this is edited"}]

await db.has("x") // true
await db.delete("x") // true
await db.deleteAll() // true
```

> Example With Options

```js
const db = require("lweaxodb")
db.setReadable(true) // It makes readable your JSON DB file.
db.noBlankData(true) // If you delete anything from object and new object size is less than 1, automaticly removes that object.
db.setAdapter("yamldb") // It makes adapter as YAML adapter. Default adapter is JsonDB
db.setFolder("folder") // You can set database folder name
db.setFile("db") // You can set database file name
db.setCheckUpdates(true) // It warns you if any updates happens.

db.set("x.y.z", "abc") // abc

db.get("x") // {y: {z: "abc"}}
db.fetch("x") // {y: {z: "abc"}}
db.all() // {x: {y: {z: "abc"}}}

db.push("a", "hello") //  ["hello"]
db.push("a", "world") //  ["hello", "world"]
db.unpush("a", "hello") // ["world"]

db.push("b", {test: "lweaxodb"}) // [{test: "lweaxodb"}]
db.push("b", {test2: "lweaxodb2"}) // [{test: "lweaxodb"}, {test2: "lweaxodb2"}]
db.delByPriority("b", 1) // [{test2: "lweaxodb"}]
db.setByPriority("b", {newtest:"hey this is edited"}, 1) // [{newtest:"hey this is edited"}]

db.has("x") // true
db.delete("x") // true
db.deleteAll() // true
```

> WebPanel

```js
const db = require("lweaxodb")
db.setWebPanel(true, 3000) // true/false, //port
```

If you've any question, you can join to my Discord server: [Click me!](https://discord.gg/X7F9swzFR6)

Sorunuz Olursa Discord Sunucuma Gelebilirsiniz. [Bana Tıkla!](https://discord.gg/X7F9swzFR6)

---

### İletişim Bilgileri;

<a href="https://instagram.com/lweaxo"><img src="https://img.shields.io/badge/Instagram-E4405F?style=flat&logo=instagram&logoColor=white"/></a> &nbsp;
<a href="https://discord.com/users/1015356240492245054"><img src="https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white"/></a> &nbsp;
<a href="https://open.spotify.com/user/312jpshp3zb376xfqiikblv3vm6a"><img src="https://img.shields.io/badge/Spotify-1DB954?style=flat&logo=spotify&logoColor=white"/></a> &nbsp;
<a href="https://steamcommunity.com/profiles/76561199446923287/"><img src="https://img.shields.io/badge/Steam-000000?style=flat&logo=steam&logoColor=white"/></a> &nbsp;

</div>