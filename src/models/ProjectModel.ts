import { Document, Model, model, Schema, SchemaOptions,Types} from "mongoose"
import { IUserSubset, UserSubsetSchema } from "./UserModel"
//interface for the Project itself.
export interface IProject{
    projectName:String,
    owner: IUserSubset,
    personnel:{
        managers: Array<IUserSubset>,
        developers: Array<IUserSubset>
    }
}
//interface for the document
export interface IProjectDocument extends IProject,Document{}

//interface for the model itself to give us type checking on the model
export interface IProjectModel extends Model<IProjectDocument> {}

/**
 * SCHEMA DECLARATIONS
 */
const options:SchemaOptions = {
    timestamps:true
}
const ProjectSchema = new Schema<IProjectDocument, IProjectModel>({
    projectName: {type:String, required:true},
    owner: UserSubsetSchema,
    personnel: {
        managers:[ UserSubsetSchema ],
        developers: [ UserSubsetSchema ]
    }
},options)


export default model<IProjectDocument>("Project",ProjectSchema)