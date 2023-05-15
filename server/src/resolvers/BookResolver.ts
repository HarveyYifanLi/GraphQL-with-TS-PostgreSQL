import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Book } from "../entities/Book";
import { CreateBookInput } from "../entities/CreateBookInput";
import { UpdateBookInput } from "../entities/UpdateBookInput";

@Resolver()
export class BookResolver {
  @Query(() => [Book])
  books() {
    return Book.find({});
  }

  @Query(() => Book, { nullable: true })
  book(@Arg("id") id: string) {
    return Book.findOne({ where: { id } });
  }

  @Mutation(() => Book)
  async createBook(@Arg("data") data: CreateBookInput) {
    const book = Book.create({...data});

    await book.save();

    return book;
  }

  @Mutation(() => Book, { nullable: true })
  async updateBook(@Arg("id") id: string, @Arg("data") data: UpdateBookInput) {
    const book = await Book.findOne({ where: { id } });

    if (!book) throw new Error("Book not found!");

    try {
        Book.update({ id }, { ...data });
        return book;
    } catch (error) {
        console.log(error);
        return null;
    }
  }

  @Mutation(() => Boolean)
  async deleteBook(@Arg("id") id: string) {
    const book = await Book.findOne({ where: { id } });

    if (!book) throw new Error("Book not found!");
    
    try {
        await book.remove();
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
  }
}