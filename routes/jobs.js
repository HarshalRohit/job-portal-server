const express = require('express');
const router = express.Router();

const fs = require('fs');

const fileUpload = require(__dirname + '/../services/fileUpload');
const sendEmail = require(__dirname + '/../services/sendMail');

const {
  dbRetrieveAll,
  dbRetrieve,
  dbInsert,
  dbUpdate,
  dbDelete
} = require('../services/db');
const { JobModel } = require('../models/jobModel');


/* Test apply Job */
router.post('/apply/:id', fileUpload.single('resume'), async function (req, res, next) {

  const uploadFilePath = req.file.path;
  // can be something not found
  const jobId = req.params.id;
  // validate it somehow
  const jobBody = req.body;

  try {
    const result = await dbRetrieve(jobId);

    const emailParams = {
      userInfo: jobBody,
      attachmentPath: uploadFilePath,
      jobInfo: result,
    };
    await sendEmail(emailParams);

    fs.unlink(uploadFilePath, err => {
      if (err) console.log('uploaded file remove err', err);
    });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

/* GET job listing. */
router.get('/:id', async function (req, res, next) {
  const jobId = req.params.id;

  try {
    const result = await dbRetrieve(jobId);
    res.json(result)
  } catch (err) {
    console.log(err)
    res.sendStatus(400);
  }
});

/* GET jobs listing. */
router.get('/', async function (req, res, next) {
  try {
    result = await dbRetrieveAll();
    res.json(result)
  } catch (err) {
    console.log(err)
    res.sendStatus(400);
  }
});


router.post('/', async function (req, res, next) {
  // currently no validation whether the received json
  // is in correct format or not
  const job = req.body;

  try {
    result = await dbInsert(job);

    res.send(result).status(201);
  } catch (err) {
    if (err.message === 'Record exists')
      res.sendStatus(409).json('Record exists');
    else
      res.sendStatus(400);
  }
});


router.put('/:id', async function (req, res, next) {
  // can be something not found
  const jobId = req.params.id;
  // validate it somehow
  const jobBody = req.body;

  try {
    await dbUpdate(jobId, jobBody);
    res.sendStatus(204).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

router.delete('/:id', async function (req, res, next) {
  // can be something not found
  const jobId = req.params.id;

  try {
    await dbDelete(jobId);
    res.sendStatus(200).end();

  } catch (error) {
    console.log(error);
    res.sendStatus(404);

  }
});

module.exports = router;