const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobTitle: String,
    additionalDetails: String,
    location: String,
    company: String,
});

const Job = mongoose.model('Job', jobSchema);

exports.JobModel = Job;