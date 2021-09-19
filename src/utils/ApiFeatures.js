class APIFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    let queryObjCopy = { ...this.queryObj };
    let excluded = ["sort", "fields", "page", "limit"];
    excluded.forEach((el) => delete queryObjCopy[el]);
    let queryStrCopy = JSON.stringify(queryObjCopy);
    queryStrCopy = queryStrCopy.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `${match}`
    );
    this.query = this.query.find(JSON.parse(queryStrCopy));
    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      const sortedBy = this.queryObj.sort.split(",").join(" ");
      this.query = this.query.sort(sortedBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryObj.fields) {
      let wantedFields = this.queryObj.fields.split(",").join(" ");
      this.query = this.query.select(wantedFields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = +this.queryObj.page || 1;
    const limit = +this.queryObj.limit || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
