package com.oss2.bookservice.service;

import com.oss2.bookservice.model.Book;
import com.oss2.bookservice.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));
    }

    public Book createBook(Book book) {
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book bookDetails) {
        Book book = getBookById(id);
        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setPrice(bookDetails.getPrice());
        book.setStock(bookDetails.getStock());
        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    public void reduceStock(Long id, Integer quantity) {
        Book book = getBookById(id);
        if (book.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
        }
        book.setStock(book.getStock() - quantity);
        bookRepository.save(book);
    }
}
