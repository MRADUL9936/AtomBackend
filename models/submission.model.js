import mongoose, { Schema } from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    testId: {
           type: Schema.Types.ObjectId,
            ref: "Test",
           },
    userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
           },
    selections: [
                 {
                   questionId: { type: Schema.Types.ObjectId, ref: "Question" },
                    option: { type: String },
                    savedAt: Date
                 },
              ],
    endedAt: { type: Date },
    isDeleted: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
