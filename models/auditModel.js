const auditSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fbo_name: {
        type: String,
        required: true
    },
    outlet_name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'draft', 'approved', 'submitted'],
        default: 'new'
    },
    status_history: [{
        status: {
            type: String,
            enum: ['new', 'draft', 'approved', 'submitted'],
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    started_at: {
        type: Date,
        default: Date.now
    },
    status_changed_at: {
        type: Date,
        default: Date.now
    },
    location: {
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    },
    audit_number: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});
