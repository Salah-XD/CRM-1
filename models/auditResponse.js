import mongoose from 'mongoose';

const auditResponseSchema = new mongoose.Schema({
    audit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Audit',
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    answer: {
        type: String, 
    },
    comment: {
        type: String,
        default: ''
    },
    marks: {
        type: Number,
        default: 0
    },
    image_url: {
        type: String, 
        default: ''
    }
}, {
    timestamps: true
});

const AuditResponse = mongoose.model('AuditResponse', auditResponseSchema);

export default AuditResponse;
