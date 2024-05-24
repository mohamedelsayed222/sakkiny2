//============== class apiFeatures

import { paginationFunction } from './pagination.js'

export class ApiFeatures {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery
    this.queryData = queryData
  }
  pagination() {
    const { page, size } = this.queryData
    const { limit, skip } = paginationFunction({ page, size })
    this.mongooseQuery.limit(limit).skip(skip)
    return this
  }
  sort() {
    this.mongooseQuery.sort(this.queryData.sort?.replaceAll(',', ' '))
    return this
  }

  select() {
    this.mongooseQuery.select(this.queryData.select?.replaceAll(',', ' '))
    return this
  }

  filters() {
    const queryInstance = { ...this.queryData }
    // console.log(queryInstance);
    const execludedKeys = ['page', 'size', 'sort', 'select', 'search']
    execludedKeys.forEach((key) => delete queryInstance[key])
    // console.log(queryInstance)
    const queryFilter = JSON.parse(
      JSON.stringify(queryInstance).replace(
        /gt|gte|lt|lte|in|nin|eq|neq|regex/g,
        (operator) => `$${operator}`,
      ),
    )
    // console.log(queryFilter);
    this.mongooseQuery.find(queryFilter)
    return this
  }
  search(){
    if(this.queryData.search){
    this.mongooseQuery.find({
      $or: [
        { address: { $regex: this.queryData.search, $options: 'i' } },
        { description: { $regex: this.queryData.search, $options: 'i' } },
        { type: { $regex: this.queryData.search, $options: 'i' } },
        { per: { $regex: this.queryData.search, $options: 'i' } },
        { propertyStatus: { $regex: this.queryData.search, $options: 'i' } },
      ],
  })
}
return this
  }
}
