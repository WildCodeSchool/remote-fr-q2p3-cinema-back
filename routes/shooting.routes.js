const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM aap', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving documents from database');
      } else {
        res.json(result);
      }
    });
  });


router.get('/:id', (req, res) => {
    const aapId = req.params.id;
    connection.query(
      'SELECT * FROM aap WHERE id = ?',
      [aapId],
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
  const { AAP_FORMAT, AAP_DESCRIPTIF, AAP_DATE_DEPOT, AAP_DATE_COMITE, AAP_REFERENT, AAP_DOC1_INTITULE, AAP_DOC1_URL, AAP_DOC2_INTITULE, AAP_DOC2_URL, AAP_DOC3_INTITULE, AAP_DOC3_URL, AAP_DOC4_INTITULE, AAP_DOC4_URL, AAP_DOC5_INTITULE, AAP_DOC5_URL, AAP_DOC_AIDE1_INTITULE, AAP_DOC_AIDE1_URL, AAP_DOC_AIDE2_INTITULE, AAP_DOC_AIDE2_URL, AAP_DOC_AIDE3_INTITULE, AAP_DOC_AIDE3_URL, AAP_DOC_AIDE4_INTITULE, AAP_DOC_AIDE4_URL, AAP_DOC_AIDE5_INTITULE, AAP_DOC_AIDE5_URL } = req.body;
  connection.query(
    'INSERT INTO aap (AAP_FORMAT, AAP_DESCRIPTIF, AAP_DATE_DEPOT, AAP_DATE_COMITE, AAP_REFERENT, AAP_DOC1_INTITULE, AAP_DOC1_URL, AAP_DOC2_INTITULE, AAP_DOC2_URL, AAP_DOC3_INTITULE, AAP_DOC3_URL, AAP_DOC4_INTITULE, AAP_DOC4_URL, AAP_DOC5_INTITULE, AAP_DOC5_URL, AAP_DOC_AIDE1_INTITULE, AAP_DOC_AIDE1_URL, AAP_DOC_AIDE2_INTITULE, AAP_DOC_AIDE2_URL, AAP_DOC_AIDE3_INTITULE, AAP_DOC_AIDE3_URL, AAP_DOC_AIDE4_INTITULE, AAP_DOC_AIDE4_URL, AAP_DOC_AIDE5_INTITULE, AAP_DOC_AIDE5_URL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )',
    [AAP_FORMAT, AAP_DESCRIPTIF, AAP_DATE_DEPOT, AAP_DATE_COMITE, AAP_REFERENT, AAP_DOC1_INTITULE, AAP_DOC1_URL, AAP_DOC2_INTITULE, AAP_DOC2_URL, AAP_DOC3_INTITULE, AAP_DOC3_URL, AAP_DOC4_INTITULE, AAP_DOC4_URL, AAP_DOC5_INTITULE, AAP_DOC5_URL, AAP_DOC_AIDE1_INTITULE, AAP_DOC_AIDE1_URL, AAP_DOC_AIDE2_INTITULE, AAP_DOC_AIDE2_URL, AAP_DOC_AIDE3_INTITULE, AAP_DOC_AIDE3_URL, AAP_DOC_AIDE4_INTITULE, AAP_DOC_AIDE4_URL, AAP_DOC_AIDE5_INTITULE, AAP_DOC_AIDE5_URL],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the document');
      } else {
        const id = result.insertId;
        const createdAap = { id, AAP_FORMAT, AAP_DESCRIPTIF, AAP_DATE_DEPOT, AAP_DATE_COMITE, AAP_REFERENT, AAP_DOC1_INTITULE, AAP_DOC1_URL, AAP_DOC2_INTITULE, AAP_DOC2_URL, AAP_DOC3_INTITULE, AAP_DOC3_URL, AAP_DOC4_INTITULE, AAP_DOC4_URL, AAP_DOC5_INTITULE, AAP_DOC5_URL, AAP_DOC_AIDE1_INTITULE, AAP_DOC_AIDE1_URL, AAP_DOC_AIDE2_INTITULE, AAP_DOC_AIDE2_URL, AAP_DOC_AIDE3_INTITULE, AAP_DOC_AIDE3_URL, AAP_DOC_AIDE4_INTITULE, AAP_DOC_AIDE4_URL, AAP_DOC_AIDE5_INTITULE, AAP_DOC_AIDE5_URL };
        res.status(201).json(createdAap);
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const aapId = req.params.id;
  const db = connection.promise();
  let existingAap = null;
  db.query('SELECT * FROM aap WHERE id = ?', [aapId])
    .then(([results]) => {
      existingAap = results[0];
      if (!existingAap) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE aap SET ? WHERE id = ?', [req.body, aapId]);
    })
    .then(() => {
      res.status(200).json({ ...existingAap, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Document with id ${aapId} not found.`);
      else res.status(500).send('Error updating a document');
    });
});

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM aap WHERE id = ?',
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