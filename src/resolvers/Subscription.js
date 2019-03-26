import getUserId from '../utils/getUserId'

const Subscription = {
    // count: {
    //     subscribe(parent, args, { pubsub }, info) {
    //         let count = 0
    //         setInterval(() => {
    //             count++
    //             pubsub.publish('countChannel', {count})
    //         }, 1000)
    //         return pubsub.asyncIterator('countChannel')
    //     }
    // },
    comment: {
        async subscribe(parent, args, { prisma }, info) {
            const postExists = await prisma.exists.Post({ id: args.postId })
            if (!postExists) {
                throw new Error('Post not found.')
            }

            return prisma.subscription.comment({
                where: {
                    node: {
                        post: {
                            id: args.postId
                        }
                    }
                }
            }, info)
        //     const postId = db.posts.find((post) => post.id === args.postId && post.published)
        //     if (!postId) {
        //         throw new Error('Post id not found.')
        //     }
        //     return pubsub.asyncIterator(`comment ${args.postId}`)
        }
    },
    post: {
        subscribe(parent, args, { prisma }, info) {
            return prisma.subscription.post({
                where: {
                    node: {
                        published: true
                    }
                }
            }, info)
            // return pubsub.asyncIterator('post')
        }
    },
    myPost: {
        subscribe(parent, args, {
            prisma, request
        }, info) {
            const userId = getUserId(request)
            return prisma.subscription.post({
                where: {
                    node: {
                        author: {
                            id: userId
                        }
                    }
                }
            }, info)
        }
    }
}
export { Subscription as default }