exports.createProductTable = `CREATE TABLE IF NOT EXISTS products (
    id int(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title varchar(255) NOT NULL,
    price double NOT NULL,
    description text NOT NULL,
    imageUrl varchar(255) NOT NULL)`;

exports.insertProduct = `INSERT INTO products VALUES (1, 'First Book', 19.99, 'This is an Awesome Book', 'https://pngimg.com/uploads/book/book_PNG2111.png') ON DUPLICATE KEY UPDATE id=id`;