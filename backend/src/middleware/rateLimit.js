const redis = require('../middleware/redis')

const cache = (key) => async (req, res, next) => {
    try{

        const cached = await redis.get(key);

        if(cached){
            return res.status(200).json({
                fromRedis: true,
                data: cached
            })
        }

        console.log('get to the database')
        next()
    }catch(err){
        res.status(500).json({
            message: err.message
        })

        next()
    }
}

module.exports = cache