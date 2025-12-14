const notFound =(req,res,next) =>{
    const error = new Error (`Not Found- ${req.originalUrl}`)
    res.statusCode = 404;
    next(error);
}


const errorHandler = (err,req,res,next)=>{
    if(res.headersSent){
        return next(err);
    }
    res.status(err.statusCode || 500).json({
        success:false ,
        message : err.message || "Internal Server error"
    })
}


export {notFound,errorHandler}