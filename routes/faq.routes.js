const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM faq', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving documents from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
  const faqId = req.params.id;
  connection.query(
    'SELECT * FROM faq WHERE id = ?',
    [faqId],
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
  const { FAQ_THEME, FAQ_QUESTION, FAQ_REPONSE } = req.body;
  connection.query(
    'INSERT INTO faq (FAQ_THEME, FAQ_QUESTION, FAQ_REPONSE) VALUES (?, ?, ?)',
    [FAQ_THEME, FAQ_QUESTION, FAQ_REPONSE],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the document');
      } else {
        const id = result.insertId;
        const createdFaq = { id, FAQ_THEME, FAQ_QUESTION, FAQ_REPONSE };
        res.status(201).json(createdFaq);
      }
    }
  );
});
  
router.put('/:id', (req, res) => {
  const faqId = req.params.id;
  const db = connection.promise();
  let existingFaq = null;
  db.query('SELECT * FROM faq WHERE id = ?', [faqId])
    .then(([results]) => {
      existingFaq = results[0];
      if (!existingFaq) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE faq SET ? WHERE id = ?', [req.body, faqId]);
    })
    .then(() => {
      res.status(200).json({ ...existingFaq, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Document with id ${faqId} not found.`);
      else res.status(500).send('Error updating a document');
    });
});
  
router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM faq WHERE id = ?',
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