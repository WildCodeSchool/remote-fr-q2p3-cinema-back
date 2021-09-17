const router = require('express').Router();
const usersRouter = require('./users.routes');
const financementsRouter = require('./financements.routes');
const shootingRouter = require('./shooting.routes');
const moviesRouter = require('./movies.routes');
const faqRouter = require('./faq.routes');
const referentsRouter = require('./referents.routes');
const prestatairesRouter = require('./prestataires.routes');


router.use('/users', usersRouter);
router.use('/financements', financementsRouter);
router.use('/faq', faqRouter);
router.use('/shooting', shootingRouter);
router.use('/movies', moviesRouter);
router.use('/referents', referentsRouter);
router.use('/prestataires', prestatairesRouter);

module.exports = router;