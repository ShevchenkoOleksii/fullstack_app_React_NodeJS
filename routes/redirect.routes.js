const {Router} = require('express')
const Link = require('../models/Link')
const router = Router()

router.get('/:code', async (req, res) => {
    try {
        const link = await Link.findOne({code: req.params.code})

        if (link) {
            link.clicks += 1
            await link.save()
            return res.redirect(link.from)
        }

        res.status(404).json({message: 'link not found'})

    } catch (e) {
        res.status(500).json({message: `something went wrong, try again`})
    }
})

module.exports = router
