import bcrypt from 'bcrypt'

const userType = ['Coordinator', 'Member', 'Visitor']

class ValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ValidationError'
    }
}

class DuplicationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'DuplicationError'
    }
}

export default class UserServices {
    User: any
    Authorization: any
    constructor(User: any, Authorization: any) {
        this.User = User
        this.Authorization = Authorization
    }

    hashPassword(password: string): string {
        return bcrypt.hashSync(password, 10)
    }

    validateNewUser(newUser: User): void {
        if (
            !newUser.name ||
            !newUser.name.match(/^[a-zA-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]{2,}(?: [a-zA-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+){0,8}$/g)
        ) {
            throw new ValidationError('Nome inválido')
        }

        if (
            !newUser.email ||
            !newUser.email.match(
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g,
            )
        ) {
            throw new ValidationError('Email inválido')
        }

        if (!newUser.type || !userType.includes(newUser.type)) {
            throw new ValidationError('Tipo inválido')
        }

        if (!newUser.password) {
            throw new ValidationError('Senha inválida')
        }

        if (newUser.type == 'Member' && !newUser.cardid?.match(/(^(\d){10})$/g)) {
            throw new ValidationError('ID do cartão inválido')
        }
    }

    async verifyDuplicate(newUser: User) {
        let user = await this.User.getByEmail(newUser.email)

        if (user) {
            throw new DuplicationError('Email já cadastrado')
        }

        if (newUser.cardid) {
            user = await this.User.getByCardId(newUser.cardid)

            if (user) {
                throw new DuplicationError('Cartão já cadastrado')
            }
        }

        user = await this.Authorization.getByUserEmail(newUser.email)

        if (user[0]) {
            throw new DuplicationError('Email já está aguardando autorização de cadastro')
        }

        if (newUser.cardid) {
            user = await this.Authorization.getByUserCardId(newUser.cardid)

            if (user[0]) {
                throw new DuplicationError('Cartão já está aguardando autorização de cadastro')
            }
        }
    }

    async verifyDuplicateModified(newUser: User) {
        let user = await this.User.getByEmail(newUser.email)

        if (user && user.id != newUser.id) {
            throw new DuplicationError('Email já cadastrado')
        }

        if (newUser.cardid) {
            user = await this.User.getByCardId(newUser.cardid)

            if (user && user.id != newUser.id) {
                throw new DuplicationError('Cartão já cadastrado')
            }
        }
    }
}
