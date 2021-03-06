import mongo from 'mongodb'
const { ObjectID } = mongo

export default async (_, args, ctx) => {
  await ctx.user.ensureDataScientist(ctx)

  const { Dashboards } = await ctx.mongo.collections
  const { id } = args

  const { result } = await Dashboards.remove({
    _id: ObjectID(id),
  })

  return Boolean(result?.n)
}
