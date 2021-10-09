import { Document, model, Schema } from 'mongoose';
import { Post } from './port.interface';

const postSchema = new Schema({
  author: {
    ref: 'User',
    type: Schema.Types.ObjectId,
  },
  content: String,
  title: String,
});

const postModel = model<Post & Document>('Post', postSchema);

export default postModel;
