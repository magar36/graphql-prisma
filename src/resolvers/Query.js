import getUserId from '../utils/getUserId'

const Query = {
    users(parent, args, { prisma, request }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }
        
        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }]
            }
        }
        
        return prisma.query.users(opArgs, info)

            // if (!args.query) {
            //     return db.users
            // }
            // return db.users.filter((user) => user.name.toLowerCase().includes(args.query))
    },
    myPosts(parent, args, {
        prisma
    }, info) {
        const userId = getUserId(request)
        
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                author: userId
            }
        }

        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }]
        }

        return prisma.query.posts(opArgs, info)
    },
    posts(parent, args, { prisma }, info) {
        
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                published: true
            }
        }

        if (args.query) {
            opArgs.where.OR = [{
                    title_contains: args.query
                }, {
                    body_contains: args.query
                }]
        }
 
        return prisma.query.posts(opArgs, info)

            // if (!args.query) {
            //     return db.posts
            // }
            // return db.posts.filter((post) => (post.title.toLowerCase().includes(args.query) || post.body.toLowerCase().includes(args.query)))
    },
    comments(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }
        return prisma.query.comments(opArgs, info);
            // return db.comments
    },
    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)
        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [{
                        published: true
                    },
                    {
                        author: userId
                    }]
            }
        }, info)
        if (posts.length === 0) {
            throw new Error('Post not found.')
        }
        return posts[0]
    }
}

export { Query as default }