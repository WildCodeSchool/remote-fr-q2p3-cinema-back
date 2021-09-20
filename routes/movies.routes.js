const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM movies', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving movies from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
    const movieId = req.params.id;
    connection.query(
      'SELECT * FROM movies WHERE id = ?',
      [movieId],
      (err, results) => {
        if (err) {
          res.status(500).send('Error retrieving movie from database');
        } else {
          if (results.length) res.json(results[0]);
          else res.status(404).send('Movie not found');
        }
      }
    );
  });

router.post('/', (req, res) => {
  const { FILM_TITRE, FILM_ANNEE, FILM_COMMUNE, FILM_REALISATEUR, FILM_PRODUCTEUR, FILM_GENRE, FILM_FORMAT } = req.body;
  connection.query(
    'INSERT INTO movies (FILM_TITRE, FILM_ANNEE, FILM_COMMUNE, FILM_REALISATEUR, FILM_PRODUCTEUR, FILM_GENRE, FILM_FORMAT) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [FILM_TITRE, FILM_ANNEE, FILM_COMMUNE, FILM_REALISATEUR, FILM_PRODUCTEUR, FILM_GENRE, FILM_FORMAT],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the movie');
      } else {
        const id = result.insertId;
        const createdAap = { id, FILM_TITRE, FILM_ANNEE, FILM_COMMUNE, FILM_REALISATEUR, FILM_PRODUCTEUR, FILM_GENRE, FILM_FORMAT };
        res.status(201).json(createdAap);
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const movieId = req.params.id;
  const db = connection.promise();
  let existingMovie = null;
  db.query('SELECT * FROM movies WHERE id = ?', [movieId])
    .then(([results]) => {
      existingMovie = results[0];
      if (!existingMovie) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE movies SET ? WHERE id = ?', [req.body, movieId]);
    })
    .then(() => {
      res.status(200).json({ ...existingMovie, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Movie with id ${movieId} not found.`);
      else res.status(500).send('Error updating a Movie');
    });
});
  
router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM movies WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting an movie');
      } else {
        if (result.affectedRows) res.status(200).send('🎉 Movie deleted!');
        else res.status(404).send('Movie not found.');
      }
    }
  );
});

module.exports = router;