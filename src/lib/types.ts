export type userSession = {
    data:{
        user:{
            id: string
            username : string 
            email: string 
            createdAt : Date
            updatedAt : Date
            name : string | null
            image : string | null
        }
    
    }
}