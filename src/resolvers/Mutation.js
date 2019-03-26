import bcrypt from 'bcryptjs'

import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

const Mutation = {
    async createUser(parent, args, {
        prisma
    }, info) {
        const emailExists = await prisma.exists.User({ email: args.data.email })
        // const emailExists = db.users.some((user) => user.email === args.data.email)
        if (emailExists) {
            throw new Error('Email is already taken.')
        }

        const password = await hashPassword(args.data.password)

        const user = await prisma.mutation.createUser(
            {
                data: {
                    ...args.data,
                    password
                }
            })
        
        const token = generateToken(user.id)
        return {
            user,
            token
        }
        // const user = {
        //     id: uuidv4(),
        //     ...args.data
        // }
        // db.users.push(user)
        // return user
    },
    async login(parent, args, {
        prisma
    }, info) {
        const emailExists = await prisma.exists.User({
            email: args.data.email
        })
        if (!emailExists) {
            throw new Error('Email does not exist.')
        }

        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })
        const isPassword = await bcrypt.compare(args.data.password, user.password)
        if (!isPassword) {
            throw new Error('Invalid password.')
        }

        const token = generateToken(user.id)
        return {
            user,
            token
        }
    },
    async updateUser(parent, args, {
        request, prisma
    }, info) {
        // const userExists = await prisma.exists.User({ id: args.id })
        // if (!userExists) {
        //     throw new Error('User not found.')
        // }
        const userId = getUserId(request)

        if (args.data.password) {
            args.data.password = hashPassword(args.data.password)
        }

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info)
        // const user = db.users.find((user) => user.id === args.id)
        // if (!user) {
        //     throw new Error('User does not exist.')
        // }

        // if (args.data.email) {
        //     const emailTaken = db.users.some((user) => user.email === args.data.email)
        //     if (emailTaken) {
        //         throw new Error('Email id already exists.')
        //     }
        //     user.email = args.data.email
        // }
        // if (args.data.name) {
        //     user.name = args.data.name
        // }

        // if (args.data.age) {
        //     user.age = args.data.age
        // }

        // return user
    },
    async deleteUser(parent, args, {
        request, prisma
    }, info) {
        // const userExists = await prisma.exists.User({ id: args.id })
        // // const index = db.users.findIndex((user) => user.id === args.id)
        // if (!userExists) {
        //     throw new Error('User not found.')
        // }
        const userId = getUserId(request)
        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info)
        // const user = db.users.splice(index, 1)

        // db.posts = db.posts.filter((post) => {
        //     let match = post.author === args.id
        //     if (match) {
        //         db.comments = db.comments.filter((comment) => comment.post !== post.id)
        //     }
        //     return !match
        // })

        // db.comments = db.comments.filter((comment) => comment.author !== args.id)
        // return user[0]
    },
    async createPost(parent, args, {
        request, prisma, pubsub
    }, info) {
        //  const userExists = await prisma.exists.User({
        //      id: args.data.author
        //  })
        //  if (!userExists) {
        //      throw new Error('User not found.')
        //  }

        const userId = getUserId(request)
        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info)
        // const userExists = db.users.some((user) => user.id === args.data.author)
        // if (!userExists) {
        //     throw new Error('Author does not exist.')
        // }

        // const post = {
        //     id: uuidv4(),
        //     ...args.data
        // }
        // db.posts.push(post)
        // if (post.published === true) {
        //     pubsub.publish('post', {
        //         post: {
        //             mutation: 'CREATED',
        //             data: post
        //         }
        //     })
        // }
        // return post
    },
    async updatePost(parent, args, { request, prisma }, info) {
        const userId = getUserId(request)
        // const postExists = await prisma.exists.Post({ id: args.id })
        // const post = db.posts.find((post) => post.id === args.id)
        // const originalPost = {...post}
        const postExists = await prisma.exists.Post({
             id: args.id,
             author: {
                 id: userId
             }
         })
         if (!postExists) {
             throw new Error('Post not found.')
         }
        
        const isPublished = await prisma.exists.Post({
            id: args.id,
            published: true
        })
        
        if (isPublished && args.data.published === false) {            
            await prisma.mutation.deleteManyComments({
                where: {
                    post: {
                        id: args.id
                    }
                }
            })
        }

        return prisma.mutation.updatePost({
             data: {
                ...args.data
             },
             where: {
                 id: args.id
             }
         }, info)

        // if (args.data.title) {
        //     post.title = args.data.title
        // }
        // if (args.data.body) {
        //     post.body = args.data.body
        // }
        // if (typeof args.data.published === 'boolean') {
        //     post.published = args.data.published
        //     if (originalPost.published && !post.published) {
        //         pubsub.publish('post', {
        //             post: {
        //                 mutation: 'DELETED',
        //                 data: originalPost
        //             }
        //         })
        //     } else if (!originalPost.published && post.published) {
        //         pubsub.publish('post', {
        //             post: {
        //                 mutation: 'CREATED',
        //                 data: post
        //             }
        //         })
        //     }
        // } else if (post.published) {
        //     pubsub.publish('post', {
        //         post: {
        //             mutation: 'UPDATED',
        //             data: post
        //         }
        //     })
        // }

        // return post
    },
    async deletePost(parent, args, {
        request, prisma, pubsub
    }, info) {
        // posts = posts.filter((post) => post.id !== args.id)
        const userId = getUserId(request)

        // const postExists = await prisma.exists.Post({ id: args.id })
        // if (!postExists) {
        //     throw new Error('Post not found.')
        // }
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                    id: userId
                }
        })
        if (!postExists) {
            throw new Error('Post not found.')
        }
        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
        // const postIndex = db.posts.findIndex((post) => post.id === args.id)
        // if (postIndex < 0) {
        //     throw new Error('Post not found.')
        // }
        // const [post] = db.posts.splice(postIndex, 1)
        // db.comments = db.comments.filter((comment) => comment.post !== args.id)

        // pubsub.publish('post', {
        //     post: {
        //         mutation: 'DELETED',
        //         data: post
        //     }
        // })
        // return post
    },
    async createComment(parent, args, {
        request, prisma
    }, info) {
        const userId = getUserId(request)
        // const userExists = await prisma.exists.User({ id: args.data.author })
        // const postExists = await prisma.exists.Post({ id: args.data.post })
        // const userExists = db.users.some((user) => user.id === args.data.author)
        // const postExists = db.posts.some((post) => post.published && post.id === args.data.post)

        // if (!userExists) {
        //     throw new Error('Author does not exist.')
        // } else if (!postExists) {
        //     throw new Error('Post does not exist.')
        // }
        const postExists = await prisma.exists.Post({
            id: args.data.post
        })
        if (!postExists) {
            throw new Error('Post not found.')
        }

        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: userId
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }   
                }
            }
        }, info)
        // const comment = {
        //     id: uuidv4(),
        //     ...args.data
        // }

        // db.comments.push(comment)
        // pubsub.publish(`comment ${args.data.post}`, {
        //     comment: {
        //         mutation: 'CREATED',
        //         data: comment
        //     }
        // })
        // return comment
    },
    async updateComment(parent, args, {
        request, prisma
    }, info) {
        const userId = getUserId(request)

        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })
        
        if (!commentExists) {
             throw new Error('Comment does not exist.')
        }
        
        return prisma.mutation.updateComment({
            data: args.data,
            where: {
                id: args.id
            }
        }, info)
        // const comment = db.comments.find((comment) => comment.id === args.id)
        // if (!comment) {
        //     throw new Error("Comment does not exist.")
        // }
        // comment.text = args.text
        // pubsub.publish(`comment ${args.postId}`, {
        //     comment: {
        //         mutation: 'UPDATED',
        //         data: comment
        //     }
        // })
        // return comment
    },
    async deleteComment(parent, args, {
        request, prisma
    }, info) {
        const userId = getUserId(request)

        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!commentExists) {
            throw new Error('Comment does not exist.')
        }

        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)
        // const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)
        // if (commentIndex < 0) {
        //     throw new Error('Comment not found.')
        // }
        // const [comment] = db.comments.splice(commentIndex, 1)
        // pubsub.publish(`comment ${args.postId}`, {
        //     comment: {
        //         mutation: 'DELETED',
        //         data: comment
        //     }
        // })
        // return comment
    }
}

export {
    Mutation as
    default
}