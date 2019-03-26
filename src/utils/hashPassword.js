import bcrypt from 'bcryptjs'

const hashPassword = async (pwd) => {
     if (pwd.length < 8) {
         throw new Error('Invalid password.')
     }

     return await bcrypt.hash(pwd, 10)
}

export { hashPassword as default }