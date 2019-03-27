import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    fragmentReplacements
})

export { prisma as default }
// const createPostForUser = async (authorId, data) => {
//     const userExists = await prisma.exists.User({ id: authorId })
    
//     if (!userExists) {
//         throw new Error('User not found.')
//     }
//     const post = await prisma.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     }, '{ id }')

//     const user = await prisma.query.user({
//         where: {
//             id: authorId
//         }
//     }, '{ id name email posts { id title published } }')

//     return user
// }

// const updatePostForUser = async (postId, data) => {
//     const postExists = await prisma.exists.Post({
//         id: postId
//     })

//     if (!postExists) {
//         throw new Error('Post not found.')
//     }

//     const post = await (prisma.mutation.updatePost({
//         data,
//         where: {
//             id: postId
//         }
//     }, '{ author { id name email posts { id title published } } }'))

//     return post.author
// }

// createPostForUser("cjr3wmx93001a0752rcl4rwi9", {
//     title: "post1 from Shik",
//     body: "body of post1 from Shik",
//     published: true
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((e) => console.log(e.message))


// updatePostForUser("cjr47irev002j0752upy4xhsw", {
//     title: "post1 updated from prisma binding"
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((e) => console.log(e.message))