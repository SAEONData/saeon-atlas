import mongo from 'mongodb'
const { ObjectID } = mongo

export default async (_, args, ctx) => {
  await ctx.user.ensureDataScientist(ctx)
  const { Dashboards } = await ctx.mongo.collections

  const { id, layout, filters, ...otherArgs } = args
  const $set = { ...otherArgs, modifiedAt: new Date() }

  // dashboard.layout requires changing strings to MongoIDs
  if (layout) {
    $set.layout = layout.map(item => ({
      ...item,
      content: { ...item.content, id: ObjectID(item.content.id) },
    }))
  }

  // dashboard.filters requires changing strings to MongoIDs
  if (filters) {
    $set.filters = filters.map(id => ObjectID(id))
  }

  const response = await Dashboards.findOneAndUpdate(
    { _id: ObjectID(id) },
    {
      $set,
    },
    {
      returnOriginal: false,
      upsert: false,
    }
  )

  return response.value
}
