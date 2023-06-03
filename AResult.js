class AResult {
  constructor(resultPromise, dataResolver) {
    this._resultPromise = resultPromise;
    this._dataResolver = dataResolver;
  }

  ifError(defaultData) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(this._dataResolver.unpack(await this._resultPromise));
      } catch (error) {
        resolve(defaultData);
      }
    });
  }
}

module.exports = { AResult };
