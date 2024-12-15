import mongoose from 'mongoose';

const auditResponseSchema = new mongoose.Schema({
    audit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuditMangement',
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    comment: {
        type: String,
        default: ''
    },
    marks: {
        type: String,
        
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
