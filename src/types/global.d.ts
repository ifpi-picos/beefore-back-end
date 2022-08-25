export { }

declare global {
    type UserTypes = 'Coordinator' | 'Member' | 'Visitor';
    type AuthorizationTypes = 'User' | 'Reservation';
    type AuthorizationStatus = 'Pending' | 'Approved' | 'Denied';
    type EquipamentStatus = 'Avaliable' | 'Reserved'
    type Action = 'Entrada' | 'Saida'

    type User = {
        id: number;
        cardid?: string;
        name: string;
        email: string;
        password: string;
        occupation?: string;
        type: UserTypes;
        linkedin?: string;
        preferences: object;
        profileimage?: string;
    }

    type Authorization = {
        id?: number;
        userid?: number;
        type: AuthorizationTypes;
        status: AuthorizationStatus;
        laststatustime: string;
        data: User | Reservation;
    }

    type Relatory = {
        id?: number,
        userid: number,
        actions: object
    }

    type Actions = {
        [time: string]: object
    }

    namespace Express {
        interface Request {
            user: {
                id: number,
                email: string,
                name: string,
                preferences: object,
                type: UserTypes,
            }
        }
    }
}