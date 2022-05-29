const Jobs = require('../models/Jobs')
const { BadRequestError, NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')


const getAllJobs = async (req,res)=> {
    //console.log(req.user)
    const jobs = await Jobs.find({createdBy:req.user.userId}).sort('createdBy')
    res.status(StatusCodes.OK).json({jobs, count:jobs.length})
}

const getJob = async (req,res)=> {
    const { user:{userId}, params:{id:jobId}} = req
    // const { userId } = req.user
    // const { id:jobId } = req.params
    const findJob = await Jobs.findOne({_id:jobId, createdBy:userId})
    //const findJob = await Jobs.findById(jobId)
    //console.log(findJob)  
    if(!findJob){
        throw new NotFoundError(`Job with ${jobId} not found`)
    }
    res.status(StatusCodes.OK).json(findJob)
}

const createJob = async (req,res)=> {
    req.body.createdBy = req.user.userId
    const job = await Jobs.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async (req,res)=> {
    const {
        user:{userId}, 
        params:{id:jobId},
        body:{company, position}
    } = req
    // const findJob = await Jobs.findOne({_id:jobId, createdBy:userId})
    // if(!findJob){
    //     throw new NotFoundError(`Job with ${jobId} not found`)
    // }
    if(company === '' || position === ''){
        throw new BadRequestError('Please provide company and position')
    } 
    const job = await Jobs.findByIdAndUpdate(
        {_id:jobId, createdBy:userId},
        req.body,
        {new:true, runValidators:true}
    )
    if(!job){
        throw new NotFoundError(`Job with ${jobId} not found`)
    }
    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async (req,res)=> {
    const { user:{userId}, params:{id:jobId}} = req
    const deleteJob = await Jobs.findByIdAndDelete({_id:jobId, createdBy:userId})
    
    if(!deleteJob){
        throw new NotFoundError(`Job with ${jobId} not found`)
    }
    const jobs = await Jobs.find({createdBy:req.user.userId}).sort('createdBy')
    res.status(StatusCodes.OK).json({success:true, jobs, count:jobs.length})
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}