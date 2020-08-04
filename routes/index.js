// Operators for Sequelize
const { Op } = require("sequelize");


// Sequelize Model & sequelize
const Book = require('../models/book')[0]
const sequelize = require('../models/book')[1]

// Async function to export 
function allBooks(app) {
      
      // INDEX VIEW //
      
      // Route for root -->
      // It redirects it to /books
      app.get('/', (req, res) => {
        res.redirect('/books?page=1')
      })

      // GET route for /books -->
      // It gets all the books and values from the database and the count of how many are there
      app.get('/books', async (req, res) => {
        const total = await Book.count()
        const allBooks = await Book.findAll({
          attributes: ['id', 'title', 'author', 'genre', 'year'],
          limit: 10,
          offset: `${req.query.page ? req.query.page -1 : 0}0`
        });
        res.render('index', { data: allBooks, length: allBooks.length, total: total})
      })

      // POST route for /books -->
      // The request is from the serch box, it searches for any value, is case insensitive, and works for partial matches, and also returns the count
      app.post('/books', async(req, res) => {
        const search = req.body.search.toUpperCase()
        const {count, rows} = await Book.findAndCountAll({where: {
          [Op.or]: [
            sequelize.where(sequelize.fn('upper', sequelize.col('title')), {[Op.substring] : search}),
            sequelize.where(sequelize.fn('upper', sequelize.col('author')), {[Op.substring] : search}),
            sequelize.where(sequelize.fn('upper', sequelize.col('genre')), {[Op.substring] : search}),
            sequelize.where(sequelize.fn('upper', sequelize.col('year')), {[Op.substring] : search})
          ]
        }})
        res.render('index', { data: rows, length: rows.length, total: count })
      })

      // NEW BOOK VIEW //

      // GET route for setting new books -->
      // It renders the empty view
      app.get('/books/new', (req, res) => {
        res.render('new-book', {theTitle: 'New Book'})
      })

      // POST route for posting new books -->
      // When submited it creates a new entry in the database, and if something is missing it displays an error
      app.post('/books/new', async (req, res) => {
        try{
          await Book.create(req.body)
          res.redirect('/books')
        } catch (error) {
          const theBook = Book.build(req.body)
          res.render('new-book', {theTitle: 'New Book', errors: error.errors, data: theBook})
        } 
      })

      // UPDATE BOOK VIEW //
      // GET route for updating a book -->
      // It gets the book from the database and displays it's values
      app.get('/books/:id/:title', async (req, res) => {
        try {
        const theBook = await Book.findByPk((req.params.id), {
          attributes: ['title', 'author', 'genre', 'year'] });
          if (theBook.title.replace(/ /g, "-") == req.params.title) {
            res.render('update-book', {theTitle: 'A Brief History of Time', data: theBook, params: req.params})
          } else {throw Error}
        } catch (err) {res.render('error', {theTitle: 'Page Not Found'})}
      })

      // GET route for the id of a book -->
      // It redirects the id URL to the book URL, if the id doesn't exist it displays a page not found
      app.get('/books/:id', async(req, res) => {
        try {
          const theBook = await Book.findByPk(req.params.id)
          res.redirect(`/books/${theBook.id}/${theBook.title.replace(/ /g, "-")}`)
        } catch (error) {
          res.render('error', {theTitle: 'Page Not Found'})
        }  
      })

      // POST route for submitting the updated book -->
      // It updates the book in the database
      app.post('/books/:id', async(req, res) => {
        const theBook = await Book.findByPk((req.params.id));
        await theBook.update(req.body);
        res.redirect('/books')
      })

      // POST route for deleting books
      // It finds the book by it's id and deletes the record in the database
      app.post('/books/:id/delete', async (req, res) => {
        const theBook = await Book.findByPk((req.params.id));
        await theBook.destroy()
        res.redirect('/books')
      })

      app.use((req, res) => {
        res.render('page-not-found',{theTitle: 'Page Not Found'})
      })
}

  // Exports the function
  module.exports = allBooks;