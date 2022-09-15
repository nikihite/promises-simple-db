const fs = require('fs/promises');
const path = require('path');

class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }

  get(id) {
    const path = `${this.dirPath}/${id}.json`
    return fs.readFile(path)
      .then((fileData) => {
        return JSON.parse(fileData.toString());
      });
  }

}

module.exports = SimpleDb;
