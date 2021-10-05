const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM subventions GROUP BY movies_id', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving documents from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
  const subventionsId = req.params.id;
  connection.query(
    'SELECT * FROM subventions WHERE id = ?',
    [subventionsId],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving document from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('Document not found');
      }
    }
  );
});


  
router.post('/', (req, res) => {
  const { SUBVENTION_ANNEE, SUBVENTION_NUMDOSSIER, SUBVENTION_TITRE, SUBVENTION_TYPEAIDE, SUBVENTION_MONTANT_REGION, SUBVENTION_BUDGETPREVISIONNEL_FILM } = req.body;
  connection.query(
    'INSERT INTO subventions (SUBVENTION_ANNEE, SUBVENTION_NUMDOSSIER, SUBVENTION_TITRE, SUBVENTION_TYPEAIDE, SUBVENTION_MONTANT_REGION, SUBVENTION_BUDGETPREVISIONNEL_FILM, FILM_ID) VALUES (?, ?, ?, ?, ?, ?)',
    [SUBVENTION_ANNEE, SUBVENTION_NUMDOSSIER, SUBVENTION_TITRE, SUBVENTION_TYPEAIDE, SUBVENTION_MONTANT_REGION, SUBVENTION_BUDGETPREVISIONNEL_FILM],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the document');
      } else {
        const id = result.insertId;
        const createdSubventions = { id, SUBVENTION_ANNEE, SUBVENTION_NUMDOSSIER, SUBVENTION_TITRE, SUBVENTION_TYPEAIDE, SUBVENTION_MONTANT_REGION, SUBVENTION_BUDGETPREVISIONNEL_FILM, FILM_ID };
        res.status(201).json(createdSubventions);
      }
    }
  );
});
 
router.put('/:id', (req, res) => {
  const subventionsId = req.params.id;
  const db = connection.promise();
  let existingSubventions = null;
  db.query('SELECT * FROM subventions WHERE id = ?', [subventionsId])
    .then(([results]) => {
      existingSubventions = results[0];
      if (!existingSubventions) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE subventions SET ? WHERE id = ?', [req.body, subventionsId]);
    })
    .then(() => {
      res.status(200).json({ ...existingSubventions, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Document with id ${subventionsId} not found.`);
      else res.status(500).send('Error updating a document');
    });
});
  
router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM subventions WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting an document');
      } else {
        if (result.affectedRows) res.status(200).send('🎉 Document deleted!');
        else res.status(404).send('Document not found.');
      }
    }
  );
});

module.exports = router;