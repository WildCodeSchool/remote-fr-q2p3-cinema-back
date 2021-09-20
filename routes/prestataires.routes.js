const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM prestataires', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving documents from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
  const prestataireId = req.params.id;
  connection.query(
    'SELECT * FROM prestataires WHERE id = ?',
    [prestataireId],
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
    const { PRO_SIRET, PRO_INTITULE, PRO_ACTIVITE1, PRO_ACTIVITE2, PRO_ACTIVITE3, PRO_COMPLEMENT_ACTIVITE, PRO_SITE_WEB, PRO_EMAIL, PRO_ADRESSE, PRO_CODE_POSTAL, PRO_COMMUNE, PRO_TELEPHONE, PRO_SAISIE, PRO_MAJ, DEPT } = req.body;
    connection.query(
      'INSERT INTO prestataires (PRO_SIRET, PRO_INTITULE, PRO_ACTIVITE1, PRO_ACTIVITE2, PRO_ACTIVITE3, PRO_COMPLEMENT_ACTIVITE, PRO_SITE_WEB, PRO_EMAIL, PRO_ADRESSE, PRO_CODE_POSTAL, PRO_COMMUNE, PRO_TELEPHONE, PRO_SAISIE, PRO_MAJ, DEPT) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [PRO_SIRET, PRO_INTITULE, PRO_ACTIVITE1, PRO_ACTIVITE2, PRO_ACTIVITE3, PRO_COMPLEMENT_ACTIVITE, PRO_SITE_WEB, PRO_EMAIL, PRO_ADRESSE, PRO_CODE_POSTAL, PRO_COMMUNE, PRO_TELEPHONE, PRO_SAISIE, PRO_MAJ, DEPT],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error saving the document');
        } else {
          const id = result.insertId;
          const createdPrestataire = { id, PRO_SIRET, PRO_INTITULE, PRO_ACTIVITE1, PRO_ACTIVITE2, PRO_ACTIVITE3, PRO_COMPLEMENT_ACTIVITE, PRO_SITE_WEB, PRO_EMAIL, PRO_ADRESSE, PRO_CODE_POSTAL, PRO_COMMUNE, PRO_TELEPHONE, PRO_SAISIE, PRO_MAJ, DEPT };
          res.status(201).json(createdPrestataire);
        }
      }
    );
  });
  
router.put('/:id', (req, res) => {
  const prestataireId = req.params.id;
  const db = connection.promise();
  let existingPrestataire = null;
  db.query('SELECT * FROM prestataires WHERE id = ?', [prestataireId])
    .then(([results]) => {
      existingPrestataire = results[0];
      if (!existingPrestataire) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE prestataires SET ? WHERE id = ?', [req.body, prestataireId]);
    })
    .then(() => {
      res.status(200).json({ ...existingPrestataire, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Document with id ${prestataireId} not found.`);
      else res.status(500).send('Error updating a document');
    });
});
  
router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM prestataires WHERE id = ?',
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