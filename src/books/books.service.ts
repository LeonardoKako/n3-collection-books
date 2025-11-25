import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    try {
      const bookData = {
        title: createBookDto.title,
        year: createBookDto.year,
        author: createBookDto.author,
      };

      const newBook = this.booksRepository.create(bookData);
      await this.booksRepository.save(newBook);
      return newBook;
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (e.code === '23505') {
        throw new ConflictException('Livro já cadastrado');
      }
      throw e;
    }
  }

  findAll() {
    return this.booksRepository.find();
  }

  async findOne(id: number) {
    const book = await this.booksRepository.findOneBy({ id });
    if (!book) throw new NotFoundException('Livro não encontrado');
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const bookData = {
      title: updateBookDto?.title,
      year: updateBookDto?.year,
      author: updateBookDto?.author,
    };

    const book = await this.booksRepository.preload({
      id,
      ...bookData,
    });
    if (!book) throw new NotFoundException('Livro não encontrado');

    return this.booksRepository.save(book);
  }

  async remove(id: number) {
    const book = await this.booksRepository.findOneBy({ id });
    if (!book) throw new NotFoundException('Livro não encontrado');

    const bookRemoved = await this.booksRepository.remove(book);
    return bookRemoved;
  }
}
