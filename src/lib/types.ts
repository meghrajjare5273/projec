export type userSession = {
            id: string
            username : string | null
            email: string
            emailVerified : boolean 
            createdAt : Date
            updatedAt : Date
            name : string | null
            image : string | null
}