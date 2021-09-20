const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM referents', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving documents from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
  const referentId = req.params.id;
  connection.query(
    'SELECT * FROM referents WHERE id = ?',
    [referentId],
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
const { CT_NOM, CT_FONCTION, CT_FORMATS, CT_MAIL } = req.body;
connection.query(
    'INSERT INTO referents (CT_NOM, CT_FONCTION, CT_FORMATS, CT_MAIL) VALUES (?, ?, ?, ?)',
    [CT_NOM, CT_FONCTION, CT_FORMATS, CT_MAIL],
    (err, result) => {
    if (err) {
        console.error(err);
        res.status(500).send('Error saving the document');
    } else {
        const id = result.insertId;
        const createdReferent = { id, CT_NOM, CT_FONCTION, CT_FORMATS, CT_MAIL };
        res.status(201).json(createdReferent);
    }
    }
);
});
  
router.put('/:id', (req, res) => {
  const referentId = req.params.id;
  const db = connection.promise();
  let existingReferent = null;
  db.query('SELECT * FROM referents WHERE id = ?', [referentId])
    .then(([results]) => {
      existingReferent = results[0];
      if (!existingReferent) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE referents SET ? WHERE id = ?', [req.body, referentId]);
    })
    .then(() => {
      res.status(200).json({ ...existingReferent, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Document with id ${referentId} not found.`);
      else res.status(500).send('Error updating a document');
    });
});
  
router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM referents WHERE id = ?',
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