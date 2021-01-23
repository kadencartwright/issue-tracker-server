import { Document, Model, model, Schema, SchemaOptions } from "mongoose"
//interface for the Project itself.
export interface IProject{
    projectName:String,
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
    projectName:{type:String, required:true},
   
})


/**
 * SCHEMA VIRTUALS
 * computed virtual properties on a document instance
 */

//add some a way to get the project owner?

/**
 * SCHEMA METHODS
 * methods to run on a document instance
 */

export default model<IProjectDocument>("Project",ProjectSchema)