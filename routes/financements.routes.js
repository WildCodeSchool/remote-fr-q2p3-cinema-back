const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM financements', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving documents from database');
      } else {
        res.json(result);
      }
    });
  });

  router.get('/:id', (req, res) => {
    const financementId = req.params.id;
    connection.query(
      'SELECT * FROM financements WHERE id = ?',
      [financementId],
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
    const { FIN_FORMATS, FIN_STRUCTURE, FIN_DESCRIPTIF, FIN_CONTACT, FIN_TELEPHONE, FIN_MAIL, FIN_WEB, FIN_COMMUNE_INSEE, FIN_COMMUNE, FIN_INTERCO, FIN_DEPT, FIN_REGION } = req.body;
    connection.query(
      'INSERT INTO financements (FIN_FORMATS, FIN_STRUCTURE, FIN_DESCRIPTIF, FIN_CONTACT, FIN_TELEPHONE, FIN_MAIL, FIN_WEB, FIN_COMMUNE_INSEE, FIN_COMMUNE, FIN_INTERCO, FIN_DEPT, FIN_REGION) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [FIN_FORMATS, FIN_STRUCTURE, FIN_DESCRIPTIF, FIN_CONTACT, FIN_TELEPHONE, FIN_MAIL, FIN_WEB, FIN_COMMUNE_INSEE, FIN_COMMUNE, FIN_INTERCO, FIN_DEPT, FIN_REGION],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error saving the document');
        } else {
          const id = result.insertId;
          const createdFinancement = { id, FIN_FORMATS, FIN_STRUCTURE, FIN_DESCRIPTIF, FIN_CONTACT, FIN_TELEPHONE, FIN_MAIL, FIN_WEB, FIN_COMMUNE_INSEE, FIN_COMMUNE, FIN_INTERCO, FIN_DEPT, FIN_REGION };
          res.status(201).json(createdFinancement);
        }
      }
    );
  });
  
  router.put('/:id', (req, res) => {
    const financementId = req.params.id;
    const db = connection.promise();
    let existingFinancement = null;
    db.query('SELECT * FROM financements WHERE id = ?', [financementId])
      .then(([results]) => {
        existingFinancement = results[0];
        if (!existingFinancement) return Promise.reject('RECORD_NOT_FOUND');
        return db.query('UPDATE financements SET ? WHERE id = ?', [req.body, financementId]);
      })
      .then(() => {
        res.status(200).json({ ...existingFinancement, ...req.body });
      })
      .catch((err) => {
        console.error(err);
        if (err === 'RECORD_NOT_FOUND')
          res.status(404).send(`Document with id ${financementId} not found.`);
        else res.status(500).send('Error updating a document');
      });
  });
  
  router.delete('/:id', (req, res) => {
    connection.query(
      'DELETE FROM financements WHERE id = ?',
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