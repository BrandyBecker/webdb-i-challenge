const express = require('express');

//database renamed to knex
const knex = require('../data/dbConfig.js');

const router = express.Router();

//GET 
router.get('/', (req,res)=>{

    knex('accounts')
    .then(accounts => {
        res.status(200).json(accounts)
    })
    .catch(() => {
        res.status(500).json({error: 'Could not GET accounts'})
    })
})

//GET :id
router.get('/:id', (req,res)=>{

    knex.select('*').from('accounts').where('id', '=', req.params.id).first()

    .then(accounts => {
        res.status(200).json(accounts);
    })
    .catch(error => res.status(500).json({ error: 'Failed to get Account ID.'}))
    
})

//POST
router.post('/', (req,res)=>{
    if (validate(req.body)) {
        knex('accounts')
          .insert(req.body, 'id')
          .then(([id]) => id)
          .then(id => {
            knex('accounts')
              .where({ id })
              .first()
              .then(account => {
                res.status(201).json(account);
              });
          })
          .catch(() => {
            res.status(500).json({ message: 'Could not add the account.' });
          });
      } else {
        res.status(400).json({
          error: 'Please provide Name and Budget of Zero or more for the Account.',
        });
      }
})

//PUT :id
router.put('/:id', (req,res)=>{
   const changes = req.body

   knex('accounts').where({id: req.params.id}).update(changes)

   .then(account => {
    res.status(200).json(account)
})
.catch(error => res.status(500).json( {error: 'Failed to Update Account.'}))

    
})

//DELETE :id
router.delete('/:id', (req,res)=>{
    const changes = req.body

    knex('accounts').where({id: req.params.id}).delete(changes)

    .then(account => {
        res.status(200).json(account)
    })
    .catch(error => res.status(500).json( {error: 'Failed to Delete Account.'}))
})


function validate({ name, budget }) {
    return name && typeof budget === 'number' && budget >= 0;
  }

module.exports = router;