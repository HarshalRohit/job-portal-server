const mongoose = require('mongoose');
const {mongodb} = require('../config');

const debug = require('debug')('blog-server:db');

const { JobModel } = require('../models/jobModel');

// a little hack to use debug module
// couldn't solve w/o this
debug.enabled = true;

const dbUrl = mongodb.dbUrl;
const dbOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    user: mongodb.dbUser,
    pass: mongodb.dbPass,
    dbName: mongodb.dbName,
};

const db = mongoose.connection;

db.on('connecting', () => {
    // console.log('mongoose info: Trying to connect.');
    debug('Trying to connect.');
});

db.on('connected', () => {
    // console.log('mongoose info: Connected.');
    debug('Connected.');
});

db.on('error', (err) => {
    // console.log('mongoose error: ', err);
    
    debug('on error', err);
});

db.on('disconnected', () => {
    // console.log('mongoose info: disconnected');
    debug('disconnected');
});


const connectToDb = async () => {
    await mongoose.connect(dbUrl, dbOptions);
};

const dbRetrieveAll = async () => {
    const result = JobModel.find().exec();

    if(!result)
        throw new Error('Not found');
    return result;
}

/* Currently only finds by id */
const dbRetrieve = async (jobId) => {
    const result = await JobModel.findById(jobId);
    
    if(!result)
        throw new Error('Not found');
    
    return result;
};

const dbInsert = async (job) => {
    const exists = await JobModel.find(job);
    
    if(exists.length > 0)
        throw new Error('Record exists');

    const JobRecord = new JobModel(job);
    
    return await JobRecord.save();
};

const dbUpdate = async (jobId, jobBody) => {
    const updateOptions = { new: true };

    const result = await JobModel
                    .findByIdAndUpdate(jobId, jobBody, updateOptions)
                    .exec();
    
    if(!result)
        throw new Error('Not found');
    return result;
};

const dbDelete = async (jobId) => {
    const result = await JobModel
                    .findByIdAndDelete(jobId)
                    .exec();

    if(!result)
        throw new Error('Not found');

    return result;
}

exports.connectToDb = connectToDb;
exports.db = db;
exports.dbRetrieveAll = dbRetrieveAll;
exports.dbRetrieve = dbRetrieve;
exports.dbInsert = dbInsert;
exports.dbUpdate = dbUpdate;
exports.dbDelete = dbDelete;
